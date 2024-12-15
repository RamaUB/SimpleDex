// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



/**
 * @title SimpleDEX
 * @dev Un Exchange Descentralizado -simple- que permite intercambiar dos tokens.
 * @author Ramiro Reynoso
 */

contract SimpleDEX {
    IERC20 public tokenA;
    IERC20 public tokenB;
    address public owner;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        owner = msg.sender; 
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "No sos el duenio");
        _;
    }

    /**
    * @dev Eventos para reportar cuando se agrega o quita liquidez al pool, así como cuando se realiza un intercambio (swap).
    * @param _address La dirección de la wallet que agrega o quita liquidez, restringido en este caso al owner del SimpleDEX.
    * @param amountA Cantidad de TokenA (TKA) que se agrega o quita.
    * @param amountB Cantidad de TokenB (TKB) que se agrega o quita.
    * @param _address La dirección de la wallet de la persona que realiza el intercambio de tokens.
    */
    event LiquidityAdded(address indexed _address, uint256 amountA, uint256 amountB);
    event LiquidityRemoved(address indexed _address, uint256 amountA, uint256 amountB);
    event SwappedToken(address indexed _address, uint256 amountIn, uint256 amountOut);



    /// Función con parámetros predefindos por el ejercicio, para agregar liquidez al pool.
    /**
    *@notice agregar liquidez esta permitida solo al owner. Se verifica que se puedan transferir tokens del owner al contrato (requiere approve de los contratos erc20).
    * si todo funciona, luego se emite el evento para reportar que se agrego liquidez. 
    */
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "No se pudo agregar TKA al pool");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "No se pudo agregar TKB al pool");
        
        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    /// Función con parámetros predefinidos por el ejercicio, para quitar tokens del pool
    /**
    *@notice el retiro de liquidez esta permitida solo al owner. Se verifica que haya tokens suficientes y que la transferencia se concrete.
    * si todo funciona, luego se emite el evento para reportar que se quitó liquidez. 
    */
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(tokenA.balanceOf(address(this)) >= amountA, "No hay suficientes TKA en el pool");
        require(tokenB.balanceOf(address(this)) >= amountB, "No hay suficientes TKB en el pool");
        require(tokenA.transfer(msg.sender, amountA), "No se pudo transferir TKA");
        require(tokenB.transfer(msg.sender, amountB), "No se pudo transferir TKB");

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    /// Función con parámetros predefinidos por el ejercicio, para intercambiar tokens (A por B)
    /**
    *@notice el swap es free for all. Se verifica que haya tokens suficientes y que las  transferencias desde y hacia se concreten (requiere approve de los contratos de token).
    * si todo funciona, luego se emite el evento para reportar que se swappearon tokens. 
    */
    function swapAforB(uint256 amountAIn) external {
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));
        require(balanceA > 0 && balanceB > 0, "No hay liquidez en el pool");

        uint256 amountBOut = balanceB - (balanceA * balanceB) / (balanceA + amountAIn);
        require(tokenA.transferFrom(msg.sender, address(this), amountAIn), "No se pudo transferir TKA");
        require(tokenB.transfer(msg.sender, amountBOut), "No se pudo transferir TKB");

        emit SwappedToken(msg.sender, amountAIn, amountBOut);
    }

    /// Función con parámetros predefinidos por el ejercicio, para intercambiar tokens (B por A)
    /**
    *@notice el swap es free for all. Se verifica que haya tokens suficientes y que las  transferencias desde y hacia se concreten (requiere approve de los contratos de token).
    * si todo funciona, luego se emite el evento para reportar que se swappearon tokens. 
    */
    function swapBforA(uint256 amountBIn) external {
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));

        require(balanceA > 0 && balanceB > 0, "No hay liquidez en el pool");
        uint256 amountAOut = balanceA - (balanceA * balanceB) / (balanceB + amountBIn);

        require(tokenB.transferFrom(msg.sender, address(this), amountBIn), "No se pudo transferir TKB");
        require(tokenA.transfer(msg.sender, amountAOut), "No se pudo transferir TKA");

        emit SwappedToken(msg.sender, amountBIn, amountAOut);
    }

    /// Funcion con parametros predefinidos por el ejercicio para devolver el precio de un token respecto al otro
    function getPrice(address _token) external view returns (uint256 price) {
        uint256 balanceA = tokenA.balanceOf(address(this));
        uint256 balanceB = tokenB.balanceOf(address(this));

        if (_token == address(tokenA)) {
            price = (balanceB * 1e18) / balanceA;
        } else if (_token == address(tokenB)) {
            price = (balanceA * 1e18) / balanceB;
        } else {
            revert("La Address indicada no corresponde a un Token valido");
        }
        return price;
    }
}
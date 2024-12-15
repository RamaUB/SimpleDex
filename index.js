const SimpleDEXAddress = "0x0CF136a45ebDF66A546624130aBc62039fbc6968"; // Dirección del contrato SimpleDEX
const TokenAAddress = "0x17d4bc32Ec11695dE6912a03c0378b4953c45C24"; // Dirección del contrato TokenA
const TokenBAddress = "0x44D66A2211fd36003ACaa8DA258416532a07944F"; // Dirección del contrato TokenB

let provider;
let signer;
let dexContract;
let tokenAContract;
let tokenBContract;

// ABIs de los contratos SimpleDex y Tokens ERC20
const SimpleDEXABI = [{"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_address","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"SwappedToken","type":"event"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],"name":"swapAforB","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],"name":"swapBforA","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenA","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenB","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // ABI del contrato SimpleDEX
const TokenABI = [{"inputs":[{"internalType":"address","name":"initialOwner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]; // ABI del contrato ERC20

window.onload = async () => {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        //Defino las funciones para cda acciones
        document.getElementById("connectWallet").onclick = connectWallet;
        document.getElementById("refreshData").onclick = updatePoolData;
        document.getElementById("addLiquidity").onclick = addLiquidity;
        document.getElementById("removeLiquidity").onclick = removeLiquidity;
        document.getElementById("swapAforB").onclick = swapAforB;
        document.getElementById("swapBforA").onclick = swapBforA;

        //intento actualizar informacion de cant. Tokens en el pool
        await updatePoolData();
    } else {
        alert("Por favor, instala Metamask para interactuar con este Dapp.");
    }
};

async function connectWallet() {
    try {
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();
        document.getElementById("walletAddress").innerText = `Conectado: ${address}`;

        // Inicializar contratos
        dexContract = new ethers.Contract(SimpleDEXAddress, SimpleDEXABI, signer);
        tokenAContract = new ethers.Contract(TokenAAddress, TokenABI, signer);
        tokenBContract = new ethers.Contract(TokenBAddress, TokenABI, signer);

        await updatePoolData();
    } catch (error) {
        console.error("Error al conectar wallet:", error);
    }
}


async function updatePoolData() {
    try {
      // Obtener balances del pool mediante pomesa
      const [balanceA, balanceB] = await Promise.all([
        tokenAContract.balanceOf(SimpleDEXAddress),
        tokenBContract.balanceOf(SimpleDEXAddress),
      ]);
  
      const decimalsA = await tokenAContract.decimals();
      const decimalsB = await tokenBContract.decimals();

      console.log(decimalsA, decimalsB)
  
      // Actualizar el contenido de los elementos
      document.getElementById('balanceA').textContent = `Balance TokenA: ${(balanceA / (10 ** decimalsA))}`;
      document.getElementById('balanceB').textContent = `Balance TokenB: ${(balanceB / (10 ** decimalsB))}`;
    } catch (error) {
      console.error('Error al obtener datos del pool:', error);
    }
  }


async function addLiquidity() {
    try {
        const amountA = ethers.utils.parseUnits(document.getElementById("amountA").value, 18);
        const amountB = ethers.utils.parseUnits(document.getElementById("amountB").value, 18);

        // Aprobar transferencias
       
       // await tokenAContract.approve(SimpleDEXAddress, amountA);
       // await tokenBContract.approve(SimpleDEXAddress, amountB);
    
        const approveA = await tokenAContract.approve(SimpleDEXAddress, amountA);
        await approveA.wait(); // Esperar confirmación
        const approveB = await tokenBContract.approve(SimpleDEXAddress, amountB);
        await approveB.wait(); // Esperar confirmación

        // Agregar liquidez
        const tx = await dexContract.addLiquidity(amountA, amountB);
        await tx.wait();
        alert("Liquidez agregada con éxito");
    } catch (error) {
        console.error("Error al agregar liquidez:", error);
        alert("Error al agregar liquidez");
    }
}




async function removeLiquidity() {
    try {
        const amountA = ethers.utils.parseUnits(document.getElementById("removeAmountA").value, 18);
        const amountB = ethers.utils.parseUnits(document.getElementById("removeAmountB").value, 18);

        // Quitar liquidez
        const tx = await dexContract.removeLiquidity(amountA, amountB);
        await tx.wait();
        alert("Liquidez retirada con éxito");
    } catch (error) {
        console.error("Error al retirar liquidez:", error);
        alert("Error al retirar liquidez");
    }
}

async function swapAforB() {
    try {
        const amountA = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);

        // Aprobar y realizar el intercambio
        await tokenAContract.approve(SimpleDEXAddress, amountA);
        const tx = await dexContract.swapAforB(amountA);
        await tx.wait();
        alert("Intercambio realizado con éxito");
    } catch (error) {
        console.error("Error al intercambiar A por B:", error);
        alert("Error al intercambiar A por B");
    }
}

async function swapBforA() {
    try {
        const amountB = ethers.utils.parseUnits(document.getElementById("swapAmount").value, 18);

        // Aprobar y realizar el intercambio
        await tokenBContract.approve(SimpleDEXAddress, amountB);
        const tx = await dexContract.swapBforA(amountB);
        await tx.wait();
        alert("Intercambio realizado con éxito");
    } catch (error) {
        console.error("Error al intercambiar B por A:", error);
        alert("Error al intercambiar B por A");
    }
}

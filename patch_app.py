import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Firebase imports
import_str = "import { auth, db } from './firebase';\nimport { doc, onSnapshot, setDoc } from 'firebase/firestore';\n"
if "import { auth, db }" not in content:
    content = content.replace("import React, { useState, useEffect", import_str + "import React, { useState, useEffect")

# 2. Add auth and portfolio sync logic inside App component
sync_logic = '''
  // --- FIREBASE AUTH & PORTFOLIO SYNC ---
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user) {
        // Start listening to their cloud portfolio
        const unsubPort = onSnapshot(doc(db, 'users', user.uid, 'portfolio', 'data'), (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setHoldings(data.holdings || []);
            setCashBalance(data.cashBalance || 0);
            setTransactions(data.transactions || []);
          } else {
            // New user, empty portfolio
            setHoldings([]);
            setCashBalance(0);
            setTransactions([]);
          }
        });
        return () => unsubPort();
      } else {
        // Logged out
        setHoldings([]);
        setCashBalance(0);
        setTransactions([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Intercept state updates to save to Firebase
  const updateCloudPortfolio = async (newHoldings: any, newCash: any, newTx: any) => {
    if (firebaseUser) {
      await setDoc(doc(db, 'users', firebaseUser.uid, 'portfolio', 'data'), {
        holdings: newHoldings,
        cashBalance: newCash,
        transactions: newTx
      }, { merge: true });
    }
  };

  // Wrapper for setHoldings to also push to cloud
  const handleSetHoldings = (valOrFunc: any) => {
    setHoldings((prev: any) => {
      const updated = typeof valOrFunc === 'function' ? valOrFunc(prev) : valOrFunc;
      updateCloudPortfolio(updated, cashBalance, transactions);
      return updated;
    });
  };

  const handleSetCashBalance = (valOrFunc: any) => {
    setCashBalance((prev: any) => {
      const updated = typeof valOrFunc === 'function' ? valOrFunc(prev) : valOrFunc;
      updateCloudPortfolio(holdings, updated, transactions);
      return updated;
    });
  };

  const handleSetTransactions = (valOrFunc: any) => {
    setTransactions((prev: any) => {
      const updated = typeof valOrFunc === 'function' ? valOrFunc(prev) : valOrFunc;
      updateCloudPortfolio(holdings, cashBalance, updated);
      return updated;
    });
  };
  // ----------------------------------------
'''

if "FIREBASE AUTH & PORTFOLIO SYNC" not in content:
    content = content.replace("const [userProfile, setUserProfile] = useState<UserProfile | null>(", sync_logic + "\n  const [userProfile, setUserProfile] = useState<UserProfile | null>(")

content = re.sub(r'(?<!const \[holdings, )setHoldings\(', 'handleSetHoldings(', content)
content = re.sub(r'(?<!const \[cashBalance, )setCashBalance\(', 'handleSetCashBalance(', content)
content = re.sub(r'(?<!const \[transactions, )setTransactions\(', 'handleSetTransactions(', content)

content = content.replace("onSelectTab={setActiveTab}", "onSelectTab={(t) => { if ((t === 'portfolio' || t === 'community') && !firebaseUser) { setIsAuthModalOpen(true); } else { setActiveTab(t); } }}")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


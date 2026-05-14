import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useSelector } from "react-redux";

const DashBoardRight = () => {
  const { fromAccount, user } = useContext(AuthContext);

  const users = useSelector((state) => state.users.list);

  const [theAccountInfo, setTheAccountInfo] = useState(null);
  const [theTransactions, setTheTransactions] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Find logged in user
    const currentUser = users.find((u) => u.id === user.id);

    if (!currentUser) return;

    // Find selected account
    const selectedAccount = currentUser.accounts.find(
      (account) => account.id === fromAccount?.id,
    );

    // Set account info
    setTheAccountInfo(selectedAccount || null);

    // Set transactions
    setTheTransactions(currentUser.transactions || []);
  }, [fromAccount, users, user]);

  return (
    <div className="Bank_Form_Wrapper_Right">
      <div className="Bank_Form_Wrapper_Right_Top">
        <article className="Bank_Content_Wrapper_Right_Top">
          <p>Total Available Balance</p>

          <h2>&#8358; {theAccountInfo?.balance?.toLocaleString() || "0"}</h2>

          <span>Across {user?.accounts?.length || 0} Accounts</span>
        </article>
      </div>

      <div className="Bank_Form_Wrapper_Right_Bottom">
        <p>Transactions History</p>

        {theTransactions.length > 0 ? (
          theTransactions.map((transaction) => (
            <div
              className="Bank_Content_Wrapper_Right_Bottom_Transaction"
              key={transaction.id}
            >
              <span>{transaction.type === "debit" ? "Debit:" : "Credit:"}</span>

              <span>
                {transaction.type === "debit" ? "-" : "+"}
                &#8358; {transaction.amount.toLocaleString()}
              </span>
            </div>
          ))
        ) : (
          <p>No transactions yet</p>
        )}
      </div>
    </div>
  );
};

export default DashBoardRight;

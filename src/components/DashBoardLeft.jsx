import React, { useContext, useEffect, useState } from "react";
import "../page/Dashboard/css/DashboardStyle.css";
import "./css/ButtonStyle.css";

import { AuthContext } from "../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { transferFunds } from "../redux/usersSlice";

const DashBoardLeft = () => {
  const { user, fromAccount, setFromAccount } = useContext(AuthContext);

  // Safe fallback
  const users = useSelector((state) => state.users || []);

  const [recipientInfo, setRecipientInfo] = useState({
    id: 0,
    fullName: "",
    account: "",
  });

  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");

  const [amount, setAmount] = useState(0);
  const [memo, setMemo] = useState("");
  const [accountID, setAccountID] = useState("");

  const dispatch = useDispatch();

  // FIND USER BY ACCOUNT NUMBER
  const findUserbyAccountNumber = (accountNumber) => {
    const foundUser = users.find((user) =>
      user.accounts?.some((account) => account.accountNumber === accountNumber),
    );

    // If no user found
    if (!foundUser) {
      setRecipientInfo({
        id: 0,
        fullName: "",
        account: "",
      });
      return;
    }

    const accountInfo = foundUser.accounts.find(
      (account) => account.accountNumber === accountNumber,
    );

    setRecipientInfo({
      id: foundUser.id,
      fullName: foundUser.fullName,
      account: accountInfo?.name || "",
    });
  };

  // SEND FUNDS
  const handleSendFunds = (e) => {
    e.preventDefault();

    dispatch(
      transferFunds({
        userID: user?.id,
        senderAccountID: fromAccount?.id,
        recipientAccountNumber,
        reciepientID: recipientInfo?.id,
        amount: Number(amount),
        memo,
      }),
    );
  };

  // GET ACCOUNT INFO
  const getAccountInfo = () => {
    const account = user?.accounts?.find((account) => account.id == accountID);

    setFromAccount(account);
  };

  useEffect(() => {
    getAccountInfo();
  }, [accountID, user]);

  // FIND RECIPIENT WHEN ACCOUNT NUMBER IS COMPLETE
  useEffect(() => {
    if (recipientAccountNumber.length === 10) {
      findUserbyAccountNumber(recipientAccountNumber);
    } else {
      setRecipientInfo({
        id: 0,
        fullName: "",
        account: "",
      });
    }
  }, [recipientAccountNumber]);

  return (
    <div className="Bank_Form_Wrapper_Left">
      <header>
        <h4>Send Funds</h4>
      </header>

      <form onSubmit={handleSendFunds}>
        {/* FROM ACCOUNT */}
        <div className="SelectOption_ClassName_Container">
          <label>From Account</label>

          <select onChange={(e) => setAccountID(e.target.value)}>
            <option value="">Select Account</option>

            {user?.accounts?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* RECIPIENT ACCOUNT */}
        <div className="Inputs_className_Container">
          <label>Recipient Account Number</label>

          <input
            type="text"
            placeholder="Enter Account Number"
            value={recipientAccountNumber}
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
          />
        </div>

        {/* FULL NAME */}
        <div className="Inputs_className_Container">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Full Name"
            value={recipientInfo?.fullName}
            readOnly
          />
        </div>

        {/* BANK NAME */}
        <div className="Inputs_className_Container">
          <label>Bank Name</label>

          <input
            type="text"
            placeholder="Bank Name"
            value={recipientInfo?.account}
            readOnly
          />
        </div>

        {/* AMOUNT */}
        <div className="Inputs_className_Container">
          <label>Amount</label>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* MEMO */}
        <div className="TextArea_ClassName_Container">
          <label>Memo</label>

          <textarea
            placeholder="Rent, dinner, etc."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />
        </div>

        <button type="submit" className="Btn Form_Btn">
          Send Fund
        </button>
      </form>
    </div>
  );
};

export default DashBoardLeft;

import React, { useContext, useEffect, useState } from "react";
import "../page/Dashboard/css/DashboardStyle.css";
import { AuthContext } from "../context/AuthContext.jsx";
import { useSelector, useDispatch } from "react-redux";
import { transferFunds } from "../redux/usersSlice";
import "./css/ButtonStyle.css";

const DashBoardLeft = () => {
  const { user, fromAccount, setFromAccount } = useContext(AuthContext);

  const users = useSelector((state) => state.users.list);

  const dispatch = useDispatch();

  const [recipientInfo, setRecipientInfo] = useState({
    id: 0,
    fullName: "",
    account: "",
  });

  const [recipientAccountNumber, setRecipientAccountNumber] = useState("");

  const [amount, setAmount] = useState("");

  const [memo, setMemo] = useState("");

  const [accountID, setAccountID] = useState("");

  const findUserbyAccountNumber = (accountNumber) => {
    const foundUser = users.find((user) =>
      user.accounts.some((account) => account.accountNumber === accountNumber),
    );

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
      account: accountInfo.name,
    });
  };

  const handleSendFunds = (e) => {
    e.preventDefault();

    if (!fromAccount) {
      alert("Please select an account");
      return;
    }

    if (!recipientInfo.id) {
      alert("Recipient not found");
      return;
    }

    if (Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }

    // Prevent sending to yourself
    if (fromAccount.accountNumber === recipientAccountNumber) {
      alert("You cannot transfer to your own account");
      return;
    }

    dispatch(
      transferFunds({
        userID: user.id,
        senderAccountID: fromAccount.id,
        recipientAccountNumber,
        recipientID: recipientInfo.id,
        amount: Number(amount),
        memo,
      }),
    );

    // Clear form after transfer
    setRecipientAccountNumber("");
    setRecipientInfo({
      id: 0,
      fullName: "",
      account: "",
    });
    setAmount("");
    setMemo("");
  };

  const getAccountInfo = () => {
    const account = user?.accounts?.find(
      (account) => account.id === Number(accountID),
    );

    setFromAccount(account);
  };

  useEffect(() => {
    getAccountInfo();
  }, [accountID, user]);

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
        <div className="SelectOption_ClassName_Container">
          <label>From Account</label>

          <select onChange={(e) => setAccountID(e.target.value)}>
            <option value="">Select Account</option>

            {user?.accounts?.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="Inputs_className_Container">
          <label>Recipient Account Number</label>

          <input
            type="text"
            placeholder="Enter Account Number"
            value={recipientAccountNumber}
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
            maxLength={10}
          />
        </div>

        <div className="Inputs_className_Container">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Full Name"
            value={recipientInfo.fullName}
            readOnly
          />
        </div>

        <div className="Inputs_className_Container">
          <label>Account Name</label>

          <input
            type="text"
            placeholder="Account Name"
            value={recipientInfo.account}
            readOnly
          />
        </div>

        <div className="Inputs_className_Container">
          <label>Amount</label>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

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

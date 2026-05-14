import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentUser: null,
  error: null,
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    login: (state, action) => {
      const { email, password } = action.payload;
      state.error = null;

      const user = state.list.find((u) => u.email === email);

      if (!user) {
        state.error = "User not found";
        return;
      }

      if (user.password !== password) {
        state.error = "Incorrect password";
        return;
      }

      state.currentUser = user;
    },

    logout: (state) => {
      state.currentUser = null;
      state.error = null;
    },

    signUp: (state, action) => {
      const { fullName, email, password, accountNumber } = action.payload;

      const newUser = {
        id: Date.now(),

        fullName,

        email,

        password,

        accounts: [
          {
            id: 1,

            name: "Main Account",

            accountNumber,

            balance: 5000000,
          },
        ],

        transactions: [],
      };

      state.list.push(newUser);
    },

    transferFunds: (state, action) => {
      const { userID, senderAccountID, recipientAccountNumber, amount, memo } =
        action.payload;

      const sender = state.list.find((user) => user.id === userID);

      if (!sender) {
        alert("Sender not found");
        return;
      }

      const senderAccount = sender.accounts.find(
        (account) => account.id === senderAccountID,
      );

      if (!senderAccount) {
        alert("Sender account not found");
        return;
      }

      if (senderAccount.balance < amount) {
        alert("Insufficient balance");
        return;
      }

      const recipient = state.list.find((user) =>
        user.accounts.some(
          (account) => account.accountNumber === recipientAccountNumber,
        ),
      );

      if (!recipient) {
        alert("Recipient not found");
        return;
      }

      const recipientAccount = recipient.accounts.find(
        (account) => account.accountNumber === recipientAccountNumber,
      );

      if (!recipientAccount) {
        alert("Recipient account not found");
        return;
      }

      senderAccount.balance -= amount;
      recipientAccount.balance += amount;

      sender.transactions.push({
        id: Date.now(),
        type: "debit",
        amount,
        memo,
        date: new Date().toISOString(),
      });

      recipient.transactions.push({
        id: Date.now(),
        type: "credit",
        amount,
        memo,
        date: new Date().toISOString(),
      });

      alert("Funds transferred successfully");
    },
  },
});

export const { clearError, login, logout, signUp, transferFunds } =
  usersSlice.actions;

export default usersSlice.reducer;

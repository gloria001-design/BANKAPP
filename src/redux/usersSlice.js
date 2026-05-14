import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  currentUser: null,
  authError: null,
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.authError = null;
    },

    login: (state, action) => {
      const { email, password } = action.payload;

      state.authError = null;

      const user = state.list.find((u) => u.email === email);

      if (!user) {
        state.authError = "User not found";
        return;
      }

      if (user.password !== password) {
        state.authError = "Incorrect password";
        return;
      }

      state.currentUser = user;
    },

    logout: (state) => {
      state.currentUser = null;
      state.authError = null;
    },

    signUp: (state, action) => {
      const { fullName, email, password } = action.payload;

      // Generate unique 10-digit account number
      let accountNumber;

      do {
        accountNumber = Math.floor(
          1000000000 + Math.random() * 9000000000,
        ).toString();
      } while (
        state.list.some((user) =>
          user.accounts.some(
            (account) => account.accountNumber === accountNumber,
          ),
        )
      );

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

export const { clearAuthError, login, logout, signUp, transferFunds } =
  usersSlice.actions;

export default usersSlice.reducer;

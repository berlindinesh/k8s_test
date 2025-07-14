import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { thunk } from 'redux-thunk';

// Import reducers
import authReducer from './authSlice';
import userReducer from './reducers/userReducer';
import invitationReducer from './reducers/invitationReducer';
import companySettingsReducer from './reducers/companySettingsReducer';
import { authMiddleware } from './authMiddleware';

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['users', 'invitations'] // Don't persist these as they should be fresh on each session
};

// Root reducer combining all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  users: userReducer,
  invitations: invitationReducer,
  companySettings: companySettingsReducer
  // Add other reducers here as needed
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializability check
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
      // Enable thunk middleware (it's included by default in RTK, but being explicit)
      thunk: {
        extraArgument: {
          // You can add extra arguments here if needed
        }
      }
    }).concat(authMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
  // Add preloaded state if needed
  preloadedState: undefined,
});

// Create persistor
export const persistor = persistStore(store);

// Export types for TypeScript (if you're using TypeScript)
//export type RootState = ReturnType<typeof store.getState>;
//export type AppDispatch = typeof store.dispatch;

// Optional: Add store subscription for debugging
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    const state = store.getState();
    console.log('Store updated:', {
      auth: state.auth?.isAuthenticated,
      users: state.users?.users?.length || 0,
      invitations: state.invitations?.invitations?.length || 0,
      companySettings: !!state.companySettings
    });
  });
}

export default store;

// import { configureStore, combineReducers } from '@reduxjs/toolkit';
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
// import authReducer from './authSlice';
// import userReducer from './reducers/userReducer';
// import invitationReducer from './reducers/invitationReducer';
// import { authMiddleware } from './authMiddleware';
// import companySettingsReducer from './reducers/companySettingsReducer';

// // Configure persist options
// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['auth'] // Only persist auth state
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
//   users: userReducer,
//   invitations: invitationReducer,
//   companySettings: companySettingsReducer
//   // Add other reducers here as needed
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         // Ignore these action types for serializability check
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(authMiddleware),
//   devTools: process.env.NODE_ENV !== 'production',
// });

// export const persistor = persistStore(store);

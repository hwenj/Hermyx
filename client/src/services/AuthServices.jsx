import { auth, provider } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  updatePassword,
  linkWithPopup,
  unlink,
} from 'firebase/auth';
import { consts, messages } from '@hermyx/shared';

// Signs in a user in Firebase
export const firebaseSignIn = async (email, password) => {
  try {
    // Log In is done on client with Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // If Firebase user is not received, it returns the error
    if (!userCredential)
      throw {
        errors: {
          general: [messages.COULD_NOT_LOG_IN],
        },
      };
    return userCredential.user;
  } catch (error) {
    // Firebase errors and exceptions are treated by a map
    const errorBuilder = consts.FIREBASE_ERRORS[error.code];
    if (errorBuilder) {
      const mappedError = errorBuilder({ email });
      if (mappedError.field === 'username' || mappedError.field === 'email')
        mappedError.field = 'usernameEmail';
      throw {
        errors: {
          [mappedError.field]: [mappedError.message],
        },
      };
    }

    throw {
      errors: {
        general: [messages.COULD_NOT_LOG_IN],
      },
    };
  }
};

// Signs in a user using Google authentication
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    // Firebase errors and exceptions are treated by a map
    const errorBuilder = consts.FIREBASE_ERRORS[error.code];
    if (errorBuilder) {
      const mappedError = errorBuilder();
      throw {
        errors: {
          [mappedError.field]: [mappedError.message],
        },
      };
    }

    throw {
      errors: {
        general: [messages.COULD_NOT_LOG_IN],
      },
    };
  }
};

// Updates user's password
export const updateUserPassword = async (password) => {
  try {
    const user = auth.currentUser;
    return await updatePassword(user, password);
  } catch (error) {
    // Firebase errors and exceptions are treated by a map
    const errorBuilder = consts.FIREBASE_ERRORS[error.code];
    if (errorBuilder) {
      const mappedError = errorBuilder();
      throw {
        errors: {
          [mappedError.field]: [mappedError.message],
        },
      };
    }

    throw {
      errors: {
        general: [messages.COULD_NOT_LOG_IN],
      },
    };
  }
};

// Links Google account
export const linkGoogleAccount = async () => {
  try {
    return await linkWithPopup(auth.currentUser, provider);
  } catch (error) {
    // Firebase errors and exceptions are treated by a map
    const errorBuilder = consts.FIREBASE_ERRORS[error.code];
    if (errorBuilder) {
      const mappedError = errorBuilder();
      throw {
        errors: {
          [mappedError.field]: [mappedError.message],
        },
      };
    }

    throw {
      errors: {
        general: [messages.COULD_NOT_LOG_IN],
      },
    };
  }
};

// Unlinks Google account
export const unlinkGoogleAccount = async () => {
  try {
    //TODO: Only users with email authentication can unlink Google accounts, check all Firebase errors
    return await unlink(auth.currentUser, provider.PROVIDER_ID);
  } catch (error) {
    // Firebase errors and exceptions are treated by a map
    const errorBuilder = consts.FIREBASE_ERRORS[error.code];
    if (errorBuilder) {
      const mappedError = errorBuilder();
      throw {
        errors: {
          [mappedError.field]: [mappedError.message],
        },
      };
    }

    throw {
      errors: {
        general: [messages.COULD_NOT_LOG_IN],
      },
    };
  }
};

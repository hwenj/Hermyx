import { useActionState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInAction } from '../actions/AuthActions';
import { initialStateUseStateAction } from '../consts/consts.js';

export const LogIn = () => {
  const navigate = useNavigate();
  const [state, logInFormAction, isPending] = useActionState(
    logInAction,
    initialStateUseStateAction,
  );

  // Effect for navigating to home
  useEffect(() => {
    if (state.success) navigate('/home');
  }, [state.success, navigate]);

  return (
    <form action={logInFormAction} noValidate>
      {state.success && <p className='text-green-600'>Signed up!</p>}
      {state.errors?.general && (
        <p className='text-red-600'>{state.errors.general[0]}</p>
      )}

      <div>
        <label>Username/E-mail:</label>
        <input
          type='text'
          name='usernameEmail'
          defaultValue={state.data?.usernameEmail || ''}
          required
        />
        {state.errors?.usernameEmail && (
          <p className='text-red-600'>{state.errors.usernameEmail[0]}</p>
        )}
      </div>

      <div>
        <label>Password:</label>
        <input type='password' name='password' required />
        {state.errors?.password && (
          <p className='text-red-600'>{state.errors.password[0]}</p>
        )}
      </div>

      <button type='submit' disabled={isPending}>
        {isPending ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
};

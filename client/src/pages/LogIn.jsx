import { useActionState, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logInAction } from '../actions/AuthActions';
import { initialStateUseStateAction } from '../consts/consts.js';
import { Button } from '@/components/ui/button';
import { Form } from '../components/custom/form/Form';
import { InputFormField } from './../components/custom/form/InputFormField';
import { AlertForm } from './../components/custom/form/AlertForm';
import { PasswordInputFormField } from '../components/custom/form/PasswordInputFormField';

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

  // Logic for cleaning errors in fields or alerts when modifications are done
  const [clearedFields, setClearedFields] = useState({});
  const [prevServerState, setPrevServerState] = useState(state);
  const [isAlertClosed, setIsAlertClosed] = useState(false);

  // If the state has changed, field errors should be cleared
  if (state !== prevServerState) {
    setPrevServerState(state);
    setClearedFields({});
    setIsAlertClosed(false);
  }

  // When user changes field's value, the error is not shown until the form is sent again
  const handleFieldChange = (e) => {
    const fieldName = e.target.name;
    setClearedFields((prev) => ({ ...prev, [fieldName]: true }));
  };

  return (
    <main className='flex min-h-screen items-center justify-center p-4'>
      <div className='flex flex-col w-full max-w-155 gap-4'>
        <Form
          id='logInForm'
          formTitle='Log in'
          action={logInFormAction}
          legend='Application log in form.'
          footer={
            <Button
              className='w-full'
              id='sendLogIn'
              type='submit'
              form='logInForm'
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </Button>
          }
        >
          <InputFormField
            id='logInUsernameEmail'
            label='Username or e-mail (required):'
            error={
              !clearedFields.usernameEmail && state.errors?.usernameEmail
                ? state.errors.usernameEmail[0]
                : undefined
            }
            invalid={
              !clearedFields.usernameEmail && !!state.errors?.usernameEmail
            }
            type='text'
            name='usernameEmail'
            defaultValue={state.data?.usernameEmail || ''}
            autoComplete='off'
            required
            aria-invalid={
              !clearedFields.usernameEmail && !!state.errors?.usernameEmail
            }
            disabled={isPending}
            onChange={handleFieldChange}
          ></InputFormField>

          <PasswordInputFormField
            id='logInPassword'
            label='Password (required):'
            error={
              !clearedFields.password && state.errors?.password
                ? state.errors.password[0]
                : undefined
            }
            invalid={!clearedFields.password && !!state.errors?.password}
            type='password'
            name='password'
            defaultValue={state.data?.password || ''}
            autoComplete='off'
            required
            pattern='[A-Z](?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$'
            aria-invalid={!clearedFields.password && !!state.errors?.password}
            disabled={isPending}
            onChange={handleFieldChange}
          ></PasswordInputFormField>
        </Form>
        {state.errors?.general && !isAlertClosed && (
          <AlertForm onClose={() => setIsAlertClosed(true)}>
            {state.errors.general[0]}
          </AlertForm>
        )}
      </div>
    </main>
  );
};

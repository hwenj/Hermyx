import { useActionState, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMissionAction } from '../actions/MissionActions';
import { initialStateUseStateAction } from '../consts/consts';
import { messages } from '../messages/messages';
import { Button } from '@/components/ui/button';
import { Form } from '../components/custom/form/Form';
import { InputFormField } from './../components/custom/form/InputFormField';
import { AlertForm } from './../components/custom/form/AlertForm';
import { TextareaFormField } from '../components/custom/form/TextareaFormField';

export const NewMission = () => {
  const navigate = useNavigate();
  const [state, newMissionFormAction, isPending] = useActionState(
    createMissionAction,
    initialStateUseStateAction,
  );

  useEffect(() => {
    if (state.success) {
      const destination = state.redirectTo || '/';
      navigate(destination);
    }
  }, [state.success, state.redirectTo, navigate]);

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
          id='newMissionForm'
          formTitle={messages.NEW_MISSION.FORM_TITLE}
          action={newMissionFormAction}
          legend='Application new mission form.'
          footer={
            <div className='flex flex-col w-full gap-2 py-2'>
              <Button
                id='sendNewMission'
                type='submit'
                form='newMissionForm'
                disabled={isPending}
              >
                {isPending ? 'Publishing mission...' : 'Publish mission'}
              </Button>
              <Button
                id='draftNewMission'
                variant='outline'
                type='button'
                disabled={isPending}
              >
                {isPending ? 'Saving mission...' : 'Save as draft'}
              </Button>
            </div>
          }
        >
          <InputFormField
            id='newMissionTitle'
            label='Title (required):'
            error={
              !clearedFields.title && state.errors?.title
                ? state.errors.title[0]
                : undefined
            }
            invalid={!clearedFields.title && !!state.errors?.title}
            type='text'
            name='title'
            defaultValue={state.data?.title || ''}
            autoComplete='off'
            required
            maxLength={100}
            aria-invalid={!clearedFields.title && !!state.errors?.title}
            disabled={isPending}
            onChange={handleFieldChange}
          ></InputFormField>

          <TextareaFormField
            id='newMissionDescription'
            label='Description (required):'
            description={messages.NEW_MISSION.DESCRIPTION_DESCRIPTION}
            error={
              !clearedFields.description && state.errors?.description
                ? state.errors.description[0]
                : undefined
            }
            invalid={!clearedFields.description && !!state.errors?.description}
            type='text'
            name='description'
            defaultValue={state.data?.description || ''}
            autoComplete='off'
            required
            maxLength={1000}
            aria-invalid={
              !clearedFields.description && !!state.errors?.description
            }
            disabled={isPending}
            onChange={handleFieldChange}
          ></TextareaFormField>

          <InputFormField
            id='newMissionVacancies'
            label='Vacancies (required):'
            description={messages.NEW_MISSION.VACANCIES_DESCRIPTION}
            error={
              !clearedFields.vacancies && state.errors?.vacancies
                ? state.errors.vacancies[0]
                : undefined
            }
            invalid={!clearedFields.vacancies && !!state.errors?.vacancies}
            type='number'
            name='vacancies'
            defaultValue={state.data?.vacancies || ''}
            autoComplete='off'
            required
            min={1}
            step={1}
            aria-invalid={!clearedFields.vacancies && !!state.errors?.vacancies}
            disabled={isPending}
            onChange={handleFieldChange}
          ></InputFormField>

          <InputFormField
            id='newMissionReward'
            label='Reward (required):'
            error={
              !clearedFields.reward && state.errors?.reward
                ? state.errors.reward[0]
                : undefined
            }
            invalid={!clearedFields.reward && !!state.errors?.reward}
            type='number'
            name='reward'
            defaultValue={state.data?.reward || ''}
            autoComplete='off'
            required
            min={1}
            step={1}
            aria-invalid={!clearedFields.reward && !!state.errors?.reward}
            disabled={isPending}
            onChange={handleFieldChange}
          ></InputFormField>

          <InputFormField
            id='newMissionDifficulty'
            label='Difficulty (required):'
            description={messages.NEW_MISSION.DIFFICULTY_DESCRIPTION}
            error={
              !clearedFields.difficulty && state.errors?.difficulty
                ? state.errors.difficulty[0]
                : undefined
            }
            invalid={!clearedFields.difficulty && !!state.errors?.difficulty}
            type='number'
            name='difficulty'
            defaultValue={state.data?.difficulty || ''}
            autoComplete='off'
            required
            min={1}
            max={5}
            step={1}
            aria-invalid={
              !clearedFields.difficulty && !!state.errors?.difficulty
            }
            disabled={isPending}
            onChange={handleFieldChange}
          ></InputFormField>
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

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FieldLegend, FieldSet } from '@/components/ui/field';

export const Form = ({
  children,
  formTitle = 'Fill in the fields.',
  headingLevel = 'h1',
  description,
  id,
  action,
  legend,
  footer,
}) => {
  const HeadingTag = headingLevel;
  return (
    <Card asChild>
      <section>
        <CardHeader className='px-8 py-2'>
          <CardTitle className='text-3xl' asChild>
            <HeadingTag>{formTitle}</HeadingTag>
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent asChild className='px-8 py-2'>
          <form id={id} action={action} noValidate>
            <FieldSet>
              <FieldLegend className='hidden'>{legend}</FieldLegend>
              {children}
            </FieldSet>
          </form>
        </CardContent>
        {footer && <CardFooter className='px-8'>{footer}</CardFooter>}
      </section>
    </Card>
  );
};

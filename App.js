import React from 'react';
import {
  SafeAreaView,
  TextInput,
  Button,
  ActivityIndicator,
  Text,
  View,
  Switch,
} from 'react-native';
import {Formik} from 'formik';
import * as yup from 'yup';

const FieldWrapper = ({children, label, formikProps, formikKey}) => (
  <View style={{marginHorizontal: 20, marginVertical: 5}}>
    <Text style={{marginBottom: 3}}>{label}</Text>
    {children}
    <Text style={{color: 'red'}}>
      {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
    </Text>
  </View>
);
const StyledInput = ({label, formikProps, formikKey, ...rest}) => {
  const inputStyles = {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 3,
  };
  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    inputStyles.borderColor = 'red';
  }
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <TextInput
        style={inputStyles}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  );
};

const StyledSwitch = ({label, formikProps, formikKey, ...rest}) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value);
        }}
        {...rest}
      />
    </FieldWrapper>
  );
};

const validationSchema = yup.object().shape({
  email: yup.string().label('Email').email().required(),
  password: yup
    .string()
    .label('Password')
    .required()
    .min(2, 'Seems a bit short...')
    .max(10, 'We prefer insecure system, try a shorter password.'),
  agreeToTerms: yup
    .boolean()
    .label('Terms')
    .test(
      'is-true',
      'Must agree to terms to continue',
      value => value === true,
    ),
  confirmPassword: yup
    .string()
    .label('Confirm Password')
    .required()
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
});

const SignUp = ({email}) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'a@a.com') {
        reject(new Error('You playing with the fake email'));
      }
      resolve(true);
    }, 1000);
  });
};

export default () => (
  <SafeAreaView style={{marginTop: 90}}>
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      }}
      onSubmit={(values, actions) => {
        SignUp({email: values.email})
          .then(() => {
            alert(JSON.stringify(values));
          })
          .catch(error => {
            actions.setFieldError('general', error.message);
          })
          .finally(() => {
            actions.setSubmitting(false);
          });
      }}
      validationSchema={validationSchema}>
      {formikProps => (
        <React.Fragment>
          <StyledInput
            label="Email"
            formikProps={formikProps}
            formikKey="email"
            placeholder="johndoe@example.com"
            autoFocus
          />

          <StyledInput
            label="Password"
            formikProps={formikProps}
            formikKey="password"
            placeholder="password"
            secureTextEntry
          />

          <StyledInput
            label="Confirm Password"
            formikProps={formikProps}
            formikKey="confirmPassword"
            placeholder="Confirm Password"
            secureTextEntry
          />

          <StyledSwitch
            label="Agree to Terms"
            formikProps={formikProps}
            formikKey="agreeToTerms"
          />
          {formikProps.isSubmitting ? (
            <ActivityIndicator />
          ) : (
            <React.Fragment>
              <Button title="Submit" onPress={formikProps.handleSubmit}  />
              <Text style={{color: 'red'}}>{formikProps.errors.general}</Text>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Formik>
  </SafeAreaView>
);

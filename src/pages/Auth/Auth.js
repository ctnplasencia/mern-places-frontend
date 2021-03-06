import React, { useState, useContext } from 'react';

import './Auth.css';
import Card from '../../components/UIElements/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../util/validators';
import { useForm } from '../../hooks/form-hook';
import { AuthContext } from '../../context/auth-context';
import ErrorModal from '../../components/UIElements/ErrorModal/ErrorModal';
import Spinner from '../../components/UIElements/Spinner/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import ImageUpload from '../../components/ImageUpload/imageUpload';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const authSubmitHandler = async event => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/login',
                    'POST',
                    JSON.stringify({
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    }),
                    {
                        'Content-Type': 'application/json'
                    }
                );
                auth.login(responseData.userId, responseData.token);
            } catch (err) {

            }
        } else {
            try {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/signup',
                    'POST',
                    formData
                );

                auth.login(responseData.userId, responseData.token);
            } catch (err) {

            }
        }
    };

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid);
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image: {
                    value: null,
                    isValid: false
                }
            }, false);
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            <Card className='authentication'>
                {isLoading && <Spinner asOverlay />}
                <h2>Iniciar sesión</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLoginMode && (
                        <Input
                            element='input'
                            id='name'
                            type='text'
                            label='Tu nombre'
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText='Introduce un nombre'
                            onInput={inputHandler}
                        />
                    )}
                    {!isLoginMode && (<ImageUpload center id='image' onInput={inputHandler} errorText="Selecciona una imagen" />)}
                    <Input
                        element='input'
                        id='email'
                        type='email'
                        label='Correo electrónico'
                        validators={[VALIDATOR_EMAIL()]}
                        errorText='El formato no es correcto'
                        onInput={inputHandler}
                    />
                    <Input
                        element='input'
                        id='password'
                        type='password'
                        label='Contraseña'
                        validators={[VALIDATOR_MINLENGTH(6)]}
                        errorText='Introduce una contraseña válida con un mínimo de 5 caracteres'
                        onInput={inputHandler}
                    />
                    <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'Iniciar sesión' : 'Registrarse'}</Button>
                </form>

                <Button inverse onClick={switchModeHandler}>{isLoginMode ? 'Registrarse' : 'Iniciar Sesión'}</Button>

            </Card>
        </React.Fragment>
    )
};

export default Auth;
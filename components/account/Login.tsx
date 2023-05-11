import React, { useState } from 'react';
import styles from '../../styles/Login.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { useLoginMutation } from '../../generated/graphql';
import { toastOptions } from '../../utils/customToast';
import { useDispatch, useSelector } from 'react-redux';
import { setResult } from '../../context/actions';
import { useAuth } from '../../firebase/auth';
import { State } from '../../context/reducer';
import { customToast } from '../../utils/customToast';
import { ToastContainer } from 'react-toastify';

export default function Login(props: { onClick: VoidFunction }) {
    const {
        result: { results }
    } = useSelector((state: State) => state);
    const dispatch = useDispatch();
    const { signInWithEmailAndPassword } = useAuth()
    const [, login] = useLoginMutation();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const onSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault()
        const validation = await login({
            email: user.email,
            password: user.password
        })
        if (validation.data?.login.field === null && validation.data?.login.message === null) {
            await signInWithEmailAndPassword(user.email, user.password).then(function () {
                dispatch(setResult([results[0]]));
                customToast.success("Logged in!", toastOptions)
            }).catch(function (error) {
                const message = error.message.replace("Firebase:", "");
                customToast.error(message.replace(/\([^)]*\)\.?/g, ""), toastOptions);
            })
        }
        else {
            customToast.error(validation.data?.login.message!, toastOptions);
        }
    }

    return (
        <>
            <div className={styles.Login}>
                <h1>Log In</h1>
                <form role='form' onSubmit={onSubmit}>
                    <input autoComplete="off" spellCheck='false' type="email" placeholder='Email' value={user.email}
                        onChange={(event) => setUser({ ...user, email: event.target.value })} required></input>
                    <input autoComplete="off" spellCheck='false' type="password" placeholder='Password' value={user.password}
                        onChange={(event) => setUser({ ...user, password: event.target.value })} required></input>
                    <button type="submit" value="Submit" className={styles.slide}>Log in</button>
                </form>
                <p>Don&apos;t have an account? <span onClick={props.onClick}>Sign Up</span></p>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                draggable
                theme="colored"
                icon={false}
            />
        </>
    );
}
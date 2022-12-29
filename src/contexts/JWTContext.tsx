import React, { createContext, useEffect, useReducer } from 'react';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
// import axiosService from 'utils/axiosService';
import axiosService from 'utils/axiosService';
import { initialLoginContextProps } from 'types';
import { JWTContextType } from 'types/auth';

// constant
const initialState: initialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// const verifyToken: (st: string) => boolean = (serviceToken) => {
//     if (!serviceToken) {
//         return false;
//     }
//     const decoded: KeyedObject = jwtDecode(serviceToken);
//     console.log(decoded);
//     /**
//      * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
//      */
//     // return decoded.exp > Date.now() / 1000;
//     return true;
// };

const setSession = (serviceToken?: string | null) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axiosService.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axiosService.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken) {
                    setSession(serviceToken);
                    await axiosService
                        .get('profile')
                        .then((response) => {
                            dispatch({
                                type: LOGIN,
                                payload: {
                                    isLoggedIn: true,
                                    user: response.data.response
                                }
                            });
                        })
                        .catch((e) => {
                            dispatch({
                                type: LOGOUT
                            });
                        });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email: string, password: string) => {
        await axiosService.post('login', { email, password }).then((response) => {
            if (response.data.success) {
                setSession(response.data.response.token);
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: response.data.response.user
                    }
                });
            }
        });
        // .catch((e) => {
        //     // console.log(e.response);
        // });
    };

    const register = async (email: string, password: string, firstname: string, lastname: string) => {
        // todo: this flow need to be recode as it not verified
        await axiosService.post('add-user', { firstname, lastname, email, password }).then((response) => {
            if (response.data.success) {
                console.log(response);
            }
        });
    };

    const logout = () => {
        axiosService.get('logout').then((response) => {
            if (response.data.success) {
                console.log(response);
            }
        });
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = (email: string) => console.log(email);

    const updateProfile = () => {
        try {
            const serviceToken = window.localStorage.getItem('serviceToken');
            if (serviceToken) {
                setSession(serviceToken);
                axiosService
                    .get('profile')
                    .then((response) => {
                        dispatch({
                            type: LOGIN,
                            payload: {
                                isLoggedIn: true,
                                user: response.data.response
                            }
                        });
                    })
                    .catch((e) => {
                        dispatch({
                            type: LOGOUT
                        });
                    });
            } else {
                dispatch({
                    type: LOGOUT
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: LOGOUT
            });
        }
    };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

export default JWTContext;

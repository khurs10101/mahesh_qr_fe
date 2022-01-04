import { Box, Card, TextField, Button, Alert, LinearProgress } from "@mui/material";
import axios from "axios";
import { isEmpty, isError, isUndefined } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { ADMIN_SIGN_IN, ADMIN_SIGN_UP } from "../constants";
import { useNavigate, useHref } from 'react-router-dom'


let values = {
    name: "",
    userName: "",
    password: "",
    rePassword: "",
    code: ""
}

let defaultMessage = {
    isError: false,
    message: ""
}

const AuthPage = (props) => {

    const [state, setState] = useState(values)
    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)
    let navigate = useNavigate()


    useEffect(() => {
        console.log(state)
    }, [state])


    const handleChange = (e) => {
        const { name, value } = e.target
        setState({
            ...state,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        let endpoint = ""
        let params = state
        if (props.authType === 0) {
            //sign in
            endpoint = ADMIN_SIGN_IN
            delete params.name
            delete params.rePassword
        }

        if (props.authType === 1) {
            //sign up
            endpoint = ADMIN_SIGN_UP
            if (params.password != params.rePassword) {
                setMessage({
                    error: true,
                    message: "Password don't match"
                })
                return
            }
        }

        try {
            setIsLoading(true)
            let response = await axios.post(endpoint, params)
            if (!isUndefined(response)) {
                if (response.status === 200 || response.status === 201) {

                    localStorage.setItem("adminToken", response.data.token)
                    if (props.authType === 0)
                        window.location.reload(false)
                    if (props.authType === 1)
                        navigate("/")
                }
            } else {

                setMessage({
                    error: true,
                    message: "Network Error"
                })
            }
        } catch (e) {

            console.error(e)
            if (e.isAxiosError) {
                if (!isUndefined(e.response)) {
                    if (!isUndefined(e.response.data)) {
                        setMessage({
                            isError: true,
                            message: e.response.data.message
                        })
                    }
                }
            }

        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div>
            <Box sx={{ width: '100%' }}>
                {isLoading && <LinearProgress sx={{
                    height: "6px"
                }} />}
            </Box>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{
                    width: '500px',
                    border: '1px solid black',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '100px'
                }}>

                    {props.authType === 1 && <div style={{
                        marginTop: '15px'
                    }}>
                        <TextField onChange={handleChange} name="name" label="Name" variant="outlined" />
                    </div>}
                    <div style={{
                        marginTop: '15px'
                    }}>
                        <TextField type="email" onChange={handleChange} name="email" label="Email" variant="outlined" />
                    </div>
                    <div style={{
                        marginTop: '15px'
                    }}>
                        <TextField type="password" onChange={handleChange} name="password" label="Password" variant="outlined" />
                    </div>
                    {props.authType === 1 && <div style={{
                        marginTop: '15px'
                    }}>
                        <TextField type="password" onChange={handleChange} name="rePassword" label="Re password" variant="outlined" />
                    </div>}
                    <div style={{
                        marginTop: '15px'
                    }}>
                        <Button onClick={handleSubmit}>{props.authType === 1 ? "Sign Up" : "Sign in"}</Button>
                    </div>

                    <div style={{
                        marginTop: '15px'
                    }}>
                        {!isEmpty(message.message) && <Alert severity={isError ? "error" : "info"}>{message.message}</Alert>}
                    </div>

                </div>
            </div>
        </div>
    )

}

export default AuthPage
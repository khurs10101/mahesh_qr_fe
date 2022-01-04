import { Button, TextField, Box, Alert, LinearProgress } from "@mui/material";
import axios from "axios";
import { toLower, isEmpty, isUndefined } from "lodash";
import React, { useEffect, useState } from "react";
import { REDEEM_USER_COUPON_BY_ADMIN, UPDATE_USER } from "../../constants";



const UserDetailsPage = (props) => {

    let defaultMessage = {
        isError: false,
        message: ""
    }

    let defaultUserDetails = {
        ...props.user,
        availablePoints: parseInt(props.user.collectedPoints) - parseInt(props.user.redeemedPoints),
        toRedeem: 0,
        disabled: true
    }


    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)
    const [user, setUser] = useState(defaultUserDetails)

    useEffect(() => {
        console.log(user)
    }, [user])


    const handleOnChange = (e) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleOnClick = (e) => {
        const { name } = e.target
        if (name === "edit") {
            setUser({
                ...user,
                disabled: false
            })
        }

        if (name === "update") {
            handleUserUpdate()
        }

        if (name === "cancel") {
            setUser({
                ...user,
                disabled: true
            })
        }

        if (name === "redeem") {
            if (user.toRedeem > 0) {
                handleRedeemPoints()
            } else {
                setMessage({
                    isError: true,
                    message: "Redeem points should be greater than zero"
                })
            }
        }

        if (name === "back") {
            let payload = {
                name: "backFromUserSingle"
            }
            props.handleParentClick(e, payload)
        }

        if (name === "deactivate") {
            let flag = true
            if (user.isActive) {
                flag = false
            }
            handleUserUpdate(flag)
        }
    }

    const handleUserUpdate = async (isActive = true) => {

        try {
            setIsLoading(true)
            let params = {
                ...user,
                isActive
            }

            let MOD_UPDATE_USER = UPDATE_USER + `/${user._id}`

            const response = await axios.post(MOD_UPDATE_USER, params)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setUser({
                        ...user,
                        ...response.data.user,
                        disabled: true
                    })
                    setMessage({
                        isError: false,
                        message: response.data.message
                    })
                }
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


    const handleRedeemPoints = async () => {
        try {
            setIsLoading(true)
            console.log(user)
            let params = {
                userId: user._id,
                newValue: user.toRedeem
            }
            let response = await axios.post(REDEEM_USER_COUPON_BY_ADMIN, params)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setUser({
                        ...user,
                        ...response.data.user,
                        disabled: true
                    })

                    setMessage({
                        isError: false,
                        message: response.data.message
                    })
                }
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
            <div>
                <Box sx={{ width: '100%' }}>
                    {isLoading && <LinearProgress sx={{
                        height: "6px"
                    }} />}
                </Box>
                <div style={{
                    marginTop: '15px'
                }}>
                    {!isEmpty(message.message) && <Alert severity={message.isError ? "error" : "info"}>{message.message}</Alert>}
                </div>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1>User details</h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        marginRight: '8px'
                    }}>
                        <Button name="deactivate" onClick={handleOnClick} variant="contained">{user.isActive === 1 ? "Deactive" : "Activate"} User</Button>
                    </div>
                    <div>
                        <Button name="back" onClick={handleOnClick} variant="contained">Back</Button>
                    </div>
                </div>
            </div>
            <div style={{
                display: 'flex',
                marginTop: '18px',
                justifyContent: 'start',
                alignItems: 'center'
            }}>
                <div style={{
                    marginRight: '8px'
                }}>
                    <TextField onChange={handleOnChange} value={user.toRedeem} name="toRedeem" label="Enter points to redeem" variant="outlined" />
                </div>
                <div>
                    <Button name="redeem" onClick={handleRedeemPoints} variant="contained">Redeem</Button>
                </div>
            </div>
            <div style={{
                display: 'flex',
                marginTop: '18px',
                justifyContent: 'start',
                alignItems: 'center'
            }}>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.name} label="name" name="name" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.phone} label="phone" name="phone" variant="outlined" />
                </div>
            </div>
            <div style={{
                display: 'flex',
                marginTop: '18px',
                justifyContent: 'start',
                alignItems: 'center',
            }}>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.bankName} label="bankName" variant="outlined" />
                </div>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.bankAccountNumber} label="bankAccountNumber" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.bankIfscCode} label="bankIfsc" variant="outlined" />
                </div>
            </div>
            <div style={{
                display: 'flex',
                marginTop: '18px',
                justifyContent: 'start',
                alignItems: 'center'
            }}>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.city} label="city" name="city" variant="outlined" />
                </div>
                <div>
                    <TextField onChange={handleOnChange} disabled={user.disabled} value={user.states} label="state" name="state" variant="outlined" />
                </div>
            </div>
            <div style={{
                display: 'flex',
                marginTop: '18px',
                justifyContent: 'start',
                alignItems: 'center'
            }}>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField disabled={true} value={user.collectedPoints} label="collected points" variant="outlined" />
                </div>
                <div style={{
                    marginRight: '12px'
                }}>
                    <TextField disabled={true} value={user.redeemedPoints} label="redeemed points" variant="outlined" />
                </div>
                <div>
                    <TextField disabled={true} value={user.availablePoints} label="available points" variant="outlined" />
                </div>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '36px'
            }}>
                <div style={{
                    marginRight: '8px'
                }}>
                    <Button
                        variant="outlined"
                        onClick={handleOnClick}
                        name={user.disabled ? "edit" : "cancel"}
                    >
                        {user.disabled ? "Edit" : "Cancel"}
                    </Button>
                </div>
                <div>
                    {
                        !user.disabled &&
                        <Button
                            name="update"
                            onClick={handleOnClick}
                            variant="outlined"
                        >
                            Update
                        </Button>
                    }
                </div>
            </div>
        </div>
    )
}

export default UserDetailsPage
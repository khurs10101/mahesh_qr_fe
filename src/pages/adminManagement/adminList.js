import axios from "axios";
import { isUndefined, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { ADMIN_LIST, DELETE_ADMIN } from "../../constants";
import {
    Alert, Box, Button, Divider,
    LinearProgress, Table, TableBody,
    TableCell, TableContainer, TableHead,
    TableRow, TextField, Paper
} from '@mui/material'
import { DeleteOutlined } from '@mui/icons-material'

let defaultMessage = {
    isError: false,
    message: ""
}

const AdminList = (props) => {

    const [adminList, setAdminList] = useState([])
    const [q, setQ] = useState("")
    const [filtered, setFiltered] = useState([])
    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        handleFetch()
    }, [])

    useEffect(() => {
        let filtered = adminList.filter((admin) => {
            return (

                (admin.email.toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1)
            )
        })

        setFiltered(filtered)
    }, [q])

    const handleFetch = async (e) => {
        try {
            setIsLoading(true)
            let response = await axios.get(ADMIN_LIST)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setAdminList(response.data.admins)
                    setFiltered(response.data.admins)
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

    const handleClick = (e, name) => {
        if (name == "back") {
            let payload = {
                name: "back"
            }
            props.handleParentClick(e, payload)
        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        if (name === "search") {
            setQ(value)
        }
    }

    const handleDelete = async (adminId) => {
        try {
            setIsLoading(true)
            const response = await axios.post(DELETE_ADMIN, { adminId })
            if (!isUndefined(response)) {
                if (response.status === 200) {

                    setMessage({
                        isError: false,
                        message: response.data.message
                    })
                    handleFetch()
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
        <div style={{
        }}>
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
            <div>
                <h1>Admin List</h1>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <TextField onChange={handleOnChange} value={q} name="search" label="Search" variant="outlined" />
                <Button variant="contained" onClick={(e) => handleClick(e, "back")}>Back</Button>
            </div>
            <div style={{
                marginTop: '15px'
            }}>
                <Divider />
            </div>



            <div>
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 650 }} aria-label="simple table"
                    >
                        <TableHead>
                            <TableRow>
                                {/* <TableCell>Name</TableCell> */}
                                <TableCell>Email</TableCell>

                                <TableCell align="right">Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                filtered.map((admin, idx) => (
                                    <TableRow
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        {/* <TableCell>{admin.name}</TableCell> */}
                                        <TableCell component="th" scope="row">{admin.email}</TableCell>
                                        <TableCell align="right" component="th" scope="row">
                                            <DeleteOutlined onClick={() => handleDelete(admin._id)} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </div>
    )
}

export default AdminList
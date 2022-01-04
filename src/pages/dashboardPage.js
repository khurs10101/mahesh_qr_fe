import {
    Paper, TableBody, TableCell,
    TableContainer, TableHead,
    TableRow, TextField, Box, Button, Table,
    LinearProgress, Alert
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { isUndefined, isEmpty } from 'lodash'
import axios from "axios";
import { GET_ALL_COMPANIES } from "../constants";


let defaultMessage = {
    isError: false,
    message: ""
}
const DashboardPage = (props) => {

    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)
    const [companyList, setCompanyList] = useState([])
    const [filtered, setFiltered] = useState([])
    const [q, setQ] = useState("")

    useEffect(() => {
        getAllCompanyList()
    }, [])

    useEffect(() => {
        console.log(q)
        let filtered = companyList.filter((company) => {
            return (company.name.toString()
                .toLowerCase()
                .indexOf(q.toLowerCase()) > -1)
        })
        setFiltered(filtered)
        console.log(filtered)
    }, [q])

    const getAllCompanyList = async () => {

        try {
            setIsLoading(true)
            let response = await axios.get(GET_ALL_COMPANIES)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setCompanyList(response.data.companies)
                    setFiltered(response.data.companies)
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
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleOnClick = (e) => {
        const { name } = e.target
        if (name === "inventoryList") {

        }
    }

    const handleOnChange = (e) => {
        const { name, value } = e.target
        if (name === "search") {
            setQ(value)
        }
    }

    return (<div>
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
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}>
            <div>
                <TextField onChange={handleOnChange} value={q} name="search" placeholder="company name..." variant="outlined" label="search" />
            </div>
            <div>
            </div>
        </div>
        <div style={{
            marginTop: '12px'
        }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Company Name
                            </TableCell>
                            <TableCell align="right">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            filtered.map((row, idx) => {
                                return <TableRow
                                    key={idx}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button onClick={(e) => {
                                            let payload = {
                                                name: "toInventoryList",
                                                data: row
                                            }
                                            props.handleParentClick(e, payload)
                                        }} variant="outlined">
                                            Inventory List
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </div>)
}

export default DashboardPage
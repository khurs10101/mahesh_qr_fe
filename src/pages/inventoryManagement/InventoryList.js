import {
    Button, TextField, TableContainer,
    Table, TableHead, TableRow, TableBody,
    TableCell, Alert, Box, LinearProgress, Paper
} from "@mui/material";
import axios from "axios";
import { isUndefined, isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { GET_ALL_INVENTORIES, GET_INVENTORY_BY_COMPANY_NAME } from "../../constants";

let defaultMessage = {
    isError: false,
    message: ""
}
const InventoryList = (props) => {

    const [inventoryList, setInventoryList] = useState([])
    const [filtered, setFiltered] = useState([])
    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)
    const [q, setQ] = useState("")

    useEffect(() => {
        handleGetList()
    }, [])

    useEffect(() => {
        let filtered = inventoryList.filter((inventory) => {
            return (
                (inventory.companyName.toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1)
                ||
                (inventory.description.toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1)
                ||
                (inventory.serial.toString()
                    .toLowerCase()
                    .indexOf(q.toLowerCase()) > -1)
            )
        })

        setFiltered(filtered)
    }, [q])


    const handleOnChange = (e) => {

        const { name, value } = e.target
        if (name === "search") {
            setQ(value)
        }

    }

    const handleClick = (e, name) => {
        if (name === "update") {
            let payload = {
                name: "updateInventory"
            }
            props.handleParentClick(e, payload)
        }

        if (name === "back") {
            let payload = {
                name: "back"
            }
            props.handleParentClick(e, payload)
        }
    }

    const handleGetList = async () => {
        try {
            setIsLoading(true)
            let params = {
                companyName: props.company.name
            }
            let response = await axios.post(GET_INVENTORY_BY_COMPANY_NAME, params)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setInventoryList(response.data.inventories)
                    setFiltered(response.data.inventories)
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

                <TextField name="search" value={q} onChange={handleOnChange} variant="outlined" label="search" />
                <div style={{
                    display: 'flex',
                }}>
                    <div style={{
                        marginRight: '16px'
                    }}>
                        <Button onClick={(e) => handleClick(e, "update")} variant="contained">Update</Button>
                    </div>
                    <div>
                        <Button onClick={(e) => handleClick(e, "back")} variant="contained">Back</Button>
                    </div>
                </div>
            </div>
            <div style={{
                marginTop: '15px'
            }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Serial</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered.map((row, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.companyName}
                                    </TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.serial}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" onClick={(e) => {
                                            // handleRedeemPoints(row, idx)
                                            let payload = {
                                                name: "fromInventory",
                                                data: row
                                            }
                                            props.handleParentClick(e, payload)
                                        }}>Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default InventoryList
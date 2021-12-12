import Axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GET_ALL_USERS_ADMIN, REDEEM_USER_COUPON_BY_ADMIN } from '../constants'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const User = () => {
    const [userList, setUserList] = useState([])
    const [pointsToRedeem, setPointsToRedeem] = useState([])
    useEffect(() => {
        handleGetAllUsers()
    }, [userList])

    const handleGetAllUsers = async () => {
        let response = await Axios.get(GET_ALL_USERS_ADMIN)
        if (response.status == 200) {
            setUserList(response.data.users)
        }
    }

    const handleRedeemPoints = async (row, idx) => {
        debugger
        const param = {
            userId: row._id,
            newValue: parseInt(pointsToRedeem[idx])
        }

        let response = await Axios.post(REDEEM_USER_COUPON_BY_ADMIN, param);
        if (response.status == 200) {
            handleGetAllUsers()
        }
    }
    return (
        <Fragment>
            <div style={{
                margin: '15px',
            }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Phone</TableCell>
                                <TableCell align="right">Bank AC Number</TableCell>
                                <TableCell align="right">Collected</TableCell>
                                <TableCell align="right">Redeemed</TableCell>
                                <TableCell align="right">Available</TableCell>
                                <TableCell align="right">Redeem Now</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {userList.map((row, idx) => (
                                <TableRow
                                    key={row.phone}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.phone}</TableCell>
                                    <TableCell align="right">{row.bankAccountNumber}</TableCell>
                                    <TableCell align="right">{row.collectedPoints}</TableCell>
                                    <TableCell align="right">{row.redeemedPoints}</TableCell>
                                    <TableCell align="right">{parseInt(row.collectedPoints) - parseInt(row.redeemedPoints)}</TableCell>
                                    <TableCell align="right">
                                        <TextField value={pointsToRedeem[idx]} type="number" id="outlined-basic" label="Redeem Value" variant="outlined" onChange={(e) => setPointsToRedeem({ ...pointsToRedeem, [idx]: e.target.value })} />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" onClick={() => {
                                            handleRedeemPoints(row, idx)
                                        }}>Redeem</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

        </Fragment>
    )
}

export default User
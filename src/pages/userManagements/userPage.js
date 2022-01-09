import Axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { GET_ALL_USERS_ADMIN, REDEEM_USER_COUPON_BY_ADMIN } from '../../constants'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import UserJson from '../../json/users'
import { Divider } from "@mui/material";
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;


const User = (props) => {
    const [userList, setUserList] = useState([])
    const [pointsToRedeem, setPointsToRedeem] = useState([])
    useEffect(() => {
        handleGetAllUsers()
        // setUserList(UserJson)
    }, [userList])

    const handleGetAllUsers = async () => {
        let response = await Axios.get(GET_ALL_USERS_ADMIN)
        if (response.status == 200) {
            setUserList(response.data.users)
        }
    }

    const handleRedeemPoints = async (row, idx) => {
        const param = {
            userId: row._id,
            newValue: parseInt(pointsToRedeem[idx])
        }

        let response = await Axios.post(REDEEM_USER_COUPON_BY_ADMIN, param);
        if (response.status == 200) {
            handleGetAllUsers()
        }
    }

    const handleOnClick = async (e) => {
        if (e.target.name === "export") {
            handleExportExcelData()
        }
    }

    const handleExportExcelData = () => {

    }


    const DataSet = [
        {
            columns: [
                { title: "Name", style: { font: { sz: "18", bold: true } }, width: { wpx: 125 } }, // width in pixels
                { title: "Phone", style: { font: { sz: "18", bold: true } }, width: { wch: 30 } }, // width in characters
                { title: "Bank Name", style: { font: { sz: "18", bold: true } }, width: { wpx: 100 } }, // width in pixels
                { title: "Bank Account Number", style: { font: { sz: "18", bold: true } }, width: { wpx: 125 } }, // width in pixels
                { title: "Bank IFSC code", style: { font: { sz: "18", bold: true } }, width: { wpx: 100 } }, // width in pixels
                { title: "Collected points", style: { font: { sz: "18", bold: true } }, width: { wpx: 125 } }, // width in pixels
                { title: "Redeemed", style: { font: { sz: "18", bold: true } }, width: { wch: 30 } }, // width in characters
                { title: "Available", style: { font: { sz: "18", bold: true } }, width: { wpx: 125 } }, // width in pixels
                { title: "Is Active", style: { font: { sz: "18", bold: true } }, width: { wpx: 125 } }, // width in pixels
            ],
            data: userList.map((data) => [
                { value: data.name, style: { font: { sz: "14" } } },
                { value: data.phone, style: { font: { sz: "14" } } },
                { value: data.bankName, style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "3461eb" } } } },
                { value: data.bankAccountNumber, style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "eb1207" } } } },
                { value: data.bankIfscCode, style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "4bd909" } } } },
                { value: data.collectedPoints, style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "ed14f5" } } } },
                { value: data.redeemedPoints, style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "35bdb4" } } } },
                { value: parseInt(data.collectedPoints) - parseInt(data.redeemedPoints), style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "ed14f5" } } } },
                { value: data.isActive === 0 ? "Blocked" : "Active", style: { font: { color: { rgb: "ffffff" } }, fill: { patternType: "solid", fgColor: { rgb: "3461eb" } } } },
            ])
        }
    ]

    return (
        <Fragment>
            <div style={{
                margin: '15px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <TextField variant="outlined" label="Search" />
                    <div style={{
                        display: 'flex'
                    }}>
                        <div style={{
                            marginRight: '8px'
                        }}>
                            {userList.length !== 0 ? (
                                <ExcelFile
                                    filename={"user_list"}
                                    element={<Button variant="contained">Export Data as Excel</Button>}>
                                    <ExcelSheet dataSet={DataSet} name={"user_list"} />
                                </ExcelFile>
                            ) : null}
                        </div>
                        <div>
                            <Button variant="contained">Back</Button>
                        </div>

                    </div>

                </div>
                <div style={{
                    marginTop: '16px'
                }}>
                    <Divider />
                </div>
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
                                {/* <TableCell align="right">Redeem Now</TableCell> */}
                                <TableCell align="right">Is Active</TableCell>
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
                                    {/* <TableCell align="right">
                                        <TextField value={pointsToRedeem[idx]} type="number" id="outlined-basic" label="Redeem Value" variant="outlined" onChange={(e) => setPointsToRedeem({ ...pointsToRedeem, [idx]: e.target.value })} />
                                    </TableCell> */}
                                    <TableCell align="right">
                                        {
                                            row.isActive === 0 ? "Blocked" : "Active"
                                        }
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button variant="contained" onClick={(e, name) => {
                                            // handleRedeemPoints(row, idx)
                                            let payload = {
                                                name: "fromUserPage",
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

        </Fragment>
    )
}

export default User
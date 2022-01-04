import {
    Button, TextField,
    Table, TableContainer, TableRow, TableCell,
    TableBody,
    TableHead,
    Select,
    Paper,
    FormControl,
    InputLabel,
    MenuItem,
    Box,
    Alert,
    LinearProgress
} from '@mui/material'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import React, { Fragment, useEffect, useState } from 'react'
import { isEmpty, isUndefined, toLower } from 'lodash'
import axios from 'axios';
import { GET_BATCH_DETAILS_BY_PRODUCTS, GENERATE_COUPON } from '../../constants';

let defaultMessage = {
    isError: false,
    message: ""
}
const InventorySingle = (props) => {
    const inventory = props.inventory

    let defaultState = {
        companyName: inventory.companyName,
        description: inventory.description,
        label: inventory.description,
        couponType: inventory.couponTags[0],
        value: 0,
        quantity: 0
    }

    const [couponList, setCouponList] = useState([])
    const [batchList, setBatchList] = useState([])
    const [state, setState] = useState(defaultState)
    const [message, setMessage] = useState(defaultMessage)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        console.log(state)
        handleGetBatchHistory()
    }, [state])

    // Create styles
    const styles = StyleSheet.create({
        page: {
            flexDirection: 'row',
            backgroundColor: '#E4E4E4'
        },
        label: {
            height: '21.1mm',
            width: '45.7mm',
            border: '0.5px solid red',
        },
        mainSection: {
            width: '190mm',
            height: '254mm',
            border: '1px solid black',
            marginLeft: '9.2mm',
            marginRight: '9.2mm',
            marginTop: '20mm',
            marginBottom: '20mm',
        },
        singleRow: {
            flexDirection: 'row'
        },
        rowGap: {
            marginLeft: '2.2mm'
        }
    });

    const handleOnChange = (e) => {
        const { name, value } = e.target
        setState({
            ...state,
            [name]: value
        })
    }


    const handleGetBatchHistory = async () => {
        try {
            let params = {
                companyName: toLower(inventory.companyName),
                name: toLower(inventory.description)
            }
            setIsLoading(true)
            const response = await axios.post(GET_BATCH_DETAILS_BY_PRODUCTS, params)
            if (!isUndefined(response)) {
                if (response.status === 200) {
                    setBatchList(response.data.batchList)
                }
            }
        } catch (e) {
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



    const generateDocumnet = () => {
        let lenOfCouponList = couponList.length
        let couponRowJsx = []
        if (lenOfCouponList > 0) {
            let noOfRows = Math.ceil(lenOfCouponList / 4)
            for (let i = 0; i < noOfRows; i++) {
                let columnJsx = []
                for (let j = 0; j < 4; j++) {
                    let idx = (i * 4) + j
                    if (idx < couponList.length) {
                        let colX = (<Fragment>
                            <View style={styles.label}>
                            </View>
                            {
                                j !== 3 && <View style={styles.rowGap}>
                                </View>
                            }
                        </Fragment>)
                        columnJsx.push(colX)
                    }
                }
                let eachRowJsx = (<View style={styles.singleRow}>
                    {columnJsx}
                </View>)
                couponRowJsx.push(eachRowJsx)
            }
        }

        return couponRowJsx
    }

    const MyDocument = () => (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.mainSection}>
                    {generateDocumnet()}
                </View>
            </Page>
        </Document>
    );

    const handleGenerateCoupon = async (e) => {
        setMessage({
            isError: false,
            message: ''
        })
        console.log("clicked generate")
        const params = {
            companyName: state.companyName,
            name: state.description,
            label: state.label,
            value: parseInt(state.value),
            quantity: parseInt(state.quantity),
            couponType: state.couponType
        }

        if (params.value > 0 && params.quantity > 0) {

            const response = await axios.post(GENERATE_COUPON, params)

            if (response.status == 201) {
                // setCouponsList(response.data.coupons)
                handleGetBatchHistory()
            }
        } else {
            setMessage({
                isError: true,
                message: 'Please enter valid coupon value and quantity'
            })
        }

    }

    const handleOpenPrintPage = (e, row) => {
        let payload = {
            name: "toCouponPrint",
            data: row
        }
        props.handleParentClick(e, payload)
    }

    const renderSelect = () => {
        const jsx = (
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Coupon</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    label="Coupon"
                    name="couponType"
                    value={state.couponType}
                    onChange={handleOnChange}
                >
                    {
                        inventory.couponTags.map((val, idx) => {
                            return <MenuItem value={val}>{val}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        )

        return jsx
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
                {
                    !isEmpty(message.message)
                    &&
                    <Alert severity={message.isError ? "error" : "info"}>
                        {message.message}
                    </Alert>}
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1>Product Details Page</h1>
                <div>
                    <Button onClick={(e) => {
                        let payload = {
                            name: "backFromInventorySingle"
                        }
                        props.handleParentClick(e, payload)
                    }} variant="contained">Back</Button>
                </div>
            </div>


            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Company</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Label</TableCell>
                                <TableCell>Coupon Type</TableCell>
                                <TableCell>Value</TableCell>
                                <TableCell>Coupon No.</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>

                            <TableRow

                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {inventory.companyName}
                                </TableCell>
                                <TableCell>{inventory.description}</TableCell>
                                <TableCell>
                                    <TextField name="label" onChange={handleOnChange} defaultValue={inventory.description} variant="outlined" label="Label" />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {renderSelect()}
                                </TableCell>
                                <TableCell>
                                    <TextField value={state.value} name="value" onChange={handleOnChange} variant="outlined" label="Coupon value" />
                                </TableCell>
                                <TableCell>
                                    <TextField value={state.quantity} name="quantity" onChange={handleOnChange} variant="outlined" label="No of coupon" />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={(e) => {
                                        handleGenerateCoupon(e)
                                    }}>Generate</Button>
                                </TableCell>
                            </TableRow>

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div>
                <h2>History</h2>
            </div>
            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Batch</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Coupon Type</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            {
                                batchList.map((row, idx) => {
                                    return (
                                        <TableRow key={idx}>
                                            <TableCell>{row.batchNumber}</TableCell>
                                            <TableCell>{row.companyName}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.couponType}</TableCell>
                                            <TableCell>
                                                <Button onClick={(e) => handleOpenPrintPage(e, row)}>
                                                    Print
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            {/* <div style={{
                height: "100vh"
            }}>
                <PDFViewer width={"100%"} height={"100%"}>
                    <MyDocument />
                </PDFViewer>
            </div> */}
        </div>
    )
}

export default InventorySingle
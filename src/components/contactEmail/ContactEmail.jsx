
import React from 'react'
import {
    Box,
    Typography,
    Container,
    Button,
    TextField,
} from "@mui/material";


function ContactEmail() {
    return (
        <Box sx={{ bgcolor: '#e6e8e9', py: 5 }}>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: { xs: "column", md: "row" }, gap:{ xs: 3, md: 1 } }}>
                    <Typography variant="p" sx={{ color: '#000', width: { xs: '100%', sm: '100%', md: '100%', lg: '66%' } }}>
                        Be the first to know about the latest products, deals, and tips for elevating your workspace
                    </Typography>
                    <Box sx={{ width: { xs: '100%', sm: '100%', md: '100%', lg: '33%' } }}>
                        <TextField placeholder="Email Address"
                            sx={{
                                width: { xs: 150, md: 250,lg:270 },
                                bgcolor: "#fff",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 0,
                                    height: 40,
                                    "&.Mui-focused fieldset": {
                                        borderColor: "#22aaff",
                                        borderWidth: "2.5px",
                                    },
                                },
                            }}
                        ></TextField>
                        <Button variant="contained" sx={{
                            textTransform: 'uppercase', fontWeight: 700, color: '#fff', bgcolor: '#003349',  height: 40,borderRadius: 0, boxShadow: "none", py: 1, px: 2,
                            "&:hover": {
                                boxShadow: "none",
                                bgcolor: "#007fad",
                            },
                        }}>SIGN UP</Button>

                    </Box>
                </Box>
            </Container>
        </Box>
    )
}

export default ContactEmail;

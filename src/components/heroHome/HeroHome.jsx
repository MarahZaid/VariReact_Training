
import React from 'react'
import heroImg from '../../assets/imgs/Hero.jpg'

import {
    Box,
    Typography,
    Button,
} from "@mui/material";

function HeroHome() {
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: { xs: "column-reverse", md: "row" }}}>
            <Box sx={{ display: "flex", gap: {xs:2, sm:2 , md:4}, flexDirection: 'column', alignItems: 'start',px:{xs:3, sm:3 , md:2, lg:3},py:{xs:4, sm:3 , md:0}, width: { xs: "100%", md: "50%", lg:'45%'}}}>
                <Typography variant="p" sx={{ textTransform: 'uppercase', color: '#4d4d4d' }}>WORK ELEVATED</Typography>
                <Typography variant="h1" sx={{ fontSize: { xs: 25, sm: 30, md: 35, lg:44}, fontWeight: 700, fontFamily: '"Libre Franklin", sans-serif', }}>Summer Savings Start Here</Typography>
                <Typography variant="p" sx={{ color: '#000', lineHeight: 1.5, width:{xs:'100%',sm:'100%',md:'100%', lg:'87%'} }}>Kick off the season with <strong>huge savings</strong> on some of our best-sellers – but only for a limited time! Shop now for a fresh new workspace that'll keep you happy and healthy all year.</Typography>
                <Button variant="contained" sx={{
                    textTransform: 'uppercase', color: '#fff', bgcolor: '#003349', borderRadius: 0, boxShadow: "none",py:1, px:3,
                    "&:hover": {
                        boxShadow: "none",
                        bgcolor: "#007fad",
                    },
                }}>SHOP THE SALE</Button>
            </Box>
            <Box sx={{xs: "100%", md: "50%", lg:'55%'}}>
                 <Box component="img" src={heroImg} alt="Vari Hero" sx={{width: "100%", height: "100%", objectFit: "cover", display: "block",}}/>
            </Box>
        </Box>
    )
}

export default HeroHome;

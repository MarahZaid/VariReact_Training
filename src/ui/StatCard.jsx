import { Card, Box, Typography } from "@mui/material";

export default function StatCard({ label, value, icon: Icon, color = "#003349" }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "16px",
        border: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        gap: 2,
        height: "100%",
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          minWidth: 50,
          borderRadius: "12px",
          backgroundColor: `${color}1A`, // نفس اللون بشفافية خفيفة (hex + alpha)
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon sx={{ color, fontSize: 26 }} />
      </Box>

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Card>
  );
}
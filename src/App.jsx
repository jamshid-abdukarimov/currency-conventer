import { Box, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import InputAmout from "./components/InputAmout";
import SelectCountry from "./components/SelectCountry";
import SwitchCurrency from "./components/SwitchCurrency";
import { CurrencyContext } from "./context/CurrencyContext";
import MiniLoader from "./components/miniLoader";

function App() {
  const {
    fromCurrency,
    setFromCurrency,
    toCurrency,
    setToCurrency,
    firstAmount,
  } = useContext(CurrencyContext);
  const [resultCurrency, setResultCurrency] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const codeFromCurrency = fromCurrency.split(" ")[1];
  const codeToCurrency = toCurrency.split(" ")[1];

  useEffect(() => {
    if (firstAmount) {
      setLoading(true);
      axios("https://api.exchangerate.host/latest", {
        params: {
          apikey: import.meta.env.VITE_API_KEY,
          base: codeFromCurrency,
          symbols: codeToCurrency,
          // base_currency: codeFromCurrency,
          // currencies: codeToCurrency,
        },
      })
        .then((response) => {
          console.log(response.data.rates[codeToCurrency]);
          setError("");
          setResultCurrency(response.data.rates[codeToCurrency]);
        })
        .catch((error) => {
          setError(
            error?.response?.data?.errors?.currencies[0] ||
              "The selected currencies is invalid."
          );
          console.log(error);
        })
        .finally(() => setLoading(false));
    }
  }, [firstAmount, fromCurrency, toCurrency]);

  const boxStyles = {
    background: "#fdfdfd",
    marginTop: "10%",
    textAlign: "center",
    color: "#222",
    minHeight: "20rem",
    borderRadius: 2,
    padding: "4rem 2rem",
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1)",
    position: "relative",
  };

  return (
    <Container maxWidth="md" sx={boxStyles}>
      <Typography variant="h5" sx={{ marginBottom: "2rem" }}>
        Stay Ahead with Accurate Conversions
      </Typography>
      <Grid container spacing={2}>
        <InputAmout />
        <SelectCountry
          value={fromCurrency}
          setValue={setFromCurrency}
          label="From"
        />
        <SwitchCurrency />
        <SelectCountry value={toCurrency} setValue={setToCurrency} label="To" />
      </Grid>

      {loading ? (
        <Box
          sx={{ textAlign: { xs: "center", md: "left" }, marginTop: "1rem" }}
        >
          <MiniLoader />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: "left", marginTop: "1rem" }}>
          <Typography
            variant="h5"
            sx={{ marginTop: "35px", fontWeight: "bold", color: "#374151" }}
          >
            {error}
          </Typography>
        </Box>
      ) : firstAmount ? (
        <Box sx={{ textAlign: "left", marginTop: "1rem" }}>
          <Typography>
            {firstAmount} {fromCurrency} =
          </Typography>
          <Typography
            variant="h5"
            sx={{ marginTop: "5px", fontWeight: "bold" }}
          >
            {(resultCurrency * firstAmount).toFixed(3)} {toCurrency}
          </Typography>
        </Box>
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;

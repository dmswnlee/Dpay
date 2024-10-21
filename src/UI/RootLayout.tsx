import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        backgroundColor: "#F8F9FA",
      },
    },
  },
});

const RootLayout = () => {
	return (
		<ChakraProvider theme={theme} resetCSS={false}>
			<section>
				<Header />
				<main>
					<Outlet />
				</main>
			</section>
		</ChakraProvider>
	);
};

export default RootLayout;

import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      {/* Question 1 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What does hardware resource management do?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Hardware resource management is a comprehensive system that centralizes control over multiple nodes in a large system. It provides a unified dashboard to streamline the management of these nodes. This includes handling all listing processes and offering users the ability to visualize the status of multiple nodes simultaneously, making it easy to identify available resources.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Question 2 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How do we manage connecting with multiple nodes, and what if one disconnects?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Connecting with multiple nodes is managed through a robust approach utilizing multiple threading. Each thread corresponds to a specific IP, and in the event of a disconnection, the corresponding thread is gracefully removed. This ensures seamless communication and resource management even in the face of node disconnects.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Question 3 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What tech stack did we use?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The tech stack employed for this project is versatile and powerful. The frontend is developed using the MERN (MongoDB, Express.js, React, Node.js) stack, providing a dynamic and responsive user interface. On the backend, Redis serves as the key data store, while FastAPI and WebSockets are utilized to establish efficient and real-time connections between the frontend and backend components.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Question 4 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What database have we used to store the past data for analyzing?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To store past data for analysis, we opted for an in-memory database solution: Redis. Redis not only provides high-speed data retrieval but also serves as the backend for our React code, facilitating seamless integration and data flow between the frontend and backend components.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Question 5 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Why Redis, why not MongoDB and others?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Redis was chosen over other databases like MongoDB due to its exceptional speed and low latency characteristics. In a real-time system where responsiveness is crucial, Redis outperforms in terms of data retrieval and storage, making it the ideal choice for ensuring optimal performance and user experience.
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* Question 6 */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What about allocation and deallocation?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To handle allocation and deallocation efficiently, we've implemented a dedicated API. This API facilitates the smooth and controlled allocation and deallocation of resources as needed, ensuring optimal utilization and performance in the hardware resource management system.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;

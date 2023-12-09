import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap/dist/css/bootstrap.min.css";
import PropTypes from "prop-types";
import "./nav.css";
import njTransitLogo from '../../assets/njtransit.png';
import homelogo from '../../assets/homelogo.png'
export default function NavbarComponent() {
  return (
    <Navbar
      key="sm"
      expand="sm"
      className="light mb-3 pl-3 navbar text-primary navbar-custom-text"
      style={{ background: "#1c2c54"}}
      fixed="top"
    >
      <Container fluid>
        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-sm`}
          aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              className="text-primary"
              id={`offcanvasNavbarLabel-expand-sm`}
            >
              Menu
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="navbar-custom-text">
              <a href="https://www.njtransit.com/innovation" style={{textDecoration:'none',fontSize:"35px",color:"white"}}><img style={{ margin:'5px',maxWidth: '35px', maxHeight:'35px'}} src={njTransitLogo} alt="NJ Transit Logo" />Transit</a>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
}

NavbarComponent.propTypes = {
  navTitle: PropTypes.string.isRequired,
};

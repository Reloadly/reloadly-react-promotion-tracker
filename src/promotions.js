import { useState } from "react";
import axios from "axios";
import { Accordion, Card, Spinner } from "react-bootstrap";
import "./promotions.css";

const accessToken = process.env.REACT_APP_ACCESS_TOKEN;
const reloadlyJSON = `application/com.reloadly.topups-v1+json`;

const headers = {
  Accept: reloadlyJSON,
  Authorization: accessToken,
};

export default function PromoTracker() {
  const [data, setData] = useState([]);
  const [countryCode, setCountryCode] = useState("");
  const [loading, setLoading] = useState(false);

  const PromoChecker = async () => {
    setLoading(true);
    try {
      await axios
        .get(
          `https://topups.reloadly.com/promotions/country-codes/` + countryCode,
          {
            headers: headers,
          }
        )
        .then((res) => {
          setData(res.data);
        });
    } catch (e) {
      setData(e.response.data);
    }
    setLoading(false);
  };

  return (
    <div className="body">
      <section className="header">
        <section className="instructions">
          <h1>Welcome!</h1> <br></br>{" "}
          <p>
            You can search for ongoing promotions for mobile top-ups in a
            country by using the country's Alpha 2 ISO code.
          </p>{" "}
          <br></br>
          <p>
            {" "}
            Refer to this{" "}
            <a
              href="https://www.nationsonline.org/oneworld/country_code_list.htm"
              target="_blank"
              rel="noreferrer"
            >
              page
            </a>{" "}
            for a complete directory of ISO codes.
          </p>
          <section className="input_instructions">
            <input
              type="text"
              placeholder="Enter country code..."
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <button className="btn" onClick={PromoChecker} disabled={loading}>
              {loading && (
                <i
                  className="fa fa-refresh fa-spin"
                  style={{ marginRight: "5px" }}
                />
              )}
              {loading && <Spinner animation="border" />}
              {!loading && <span>Search</span>}
            </button>
          </section>
        </section>
      </section>
      <section className="response">
        {data.map((item) => (
          <Accordion key={item.id}>
            <Card className="response_card">
              <Accordion.Toggle as={Card.Header} eventKey={item}>
                {item.title} <b>&nbsp; &nbsp; &#8693;</b>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={item}>
                <Card.Body>
                  <p>{item.denominations}</p>
                  <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                  <p>{item.startDate}</p>
                  <p>{item.endDate}</p>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        ))}
      </section>
    </div>
  );
}
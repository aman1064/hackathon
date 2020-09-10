import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import Button from "../../../../atoms/Button";
import TESTIMONIALS from "./mock";
import "./testimonials.scss";
import ReadMoreModal from "./ReadMoreModal";

const TestimonialCard = ({ review, onClick }) => {
  const { msg, initials, name, designation, color } = review;
  const clickHandler = useCallback(
    () => {
      onClick(review);
    },
    [name]
  );
  return (
    <div className="testimonial-card">
      <p className="msg">
        &quot;{msg.slice(0, 186)}...&quot;{" "}
        <Button className="read-more" type="link" onClick={clickHandler}>
          read more
        </Button>
      </p>
      <div className="profile">
        <span className="initials" style={{ color }}>
          {initials}
        </span>
        <div className="detail">
          <span className="name">{name}</span>
          <span className="designation">{designation}</span>
        </div>
      </div>
    </div>
  );
};

TestimonialCard.propTypes = {
  review: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

const Testimonials = () => {
  const [modalMeta, setModalMeta] = useState(null);
  const modalCloseHandler = useCallback(
    () => {
      setModalMeta(null);
    },
    [TESTIMONIALS]
  );
  return (
    <div className="testimonials-container">
      <h2 className="heading">See what Developers are saying about us</h2>
      <div className="testimonials">
        {TESTIMONIALS.map(review => (
          <TestimonialCard review={review} onClick={setModalMeta} />
        ))}
      </div>
      <ReadMoreModal
        open={Boolean(modalMeta)}
        onClose={modalCloseHandler}
        meta={modalMeta}
      />
    </div>
  );
};

export default Testimonials;

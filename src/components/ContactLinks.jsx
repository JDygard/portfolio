import React from 'react';
import Button from './Button';
import './ContactLinks.css';

const getContactHref = (link) => {
  if (link.type === "Email") {
    return `mailto:${link.value}`;
  }

  if (link.type === "Phone") {
    return `tel:${link.value.replace(/[^+\d]/g, '')}`;
  }

  return link.value;
};

function ContactLinks({ links }) {
  return (
    <section className="contacts" data-tween-id="contact" aria-labelledby="contact-heading">
      <h3 id="contact-heading">Contact</h3>
      <ul>
        {links.map((link) => (
          <li key={link.type}>
            <Button href={getContactHref(link)} target={link.type === "Email" || link.type === "Phone" ? undefined : "_blank"} rel="noopener noreferrer">
              {link.type === "Email" || link.type === "Phone" ? link.value : link.type}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ContactLinks;

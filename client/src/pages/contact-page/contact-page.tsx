import React from "react";
import { Form, LoaderFunction, useLoaderData } from "react-router-dom";
import { IContact } from "../../processes/layouts/main-layout";

export const contactLoader: LoaderFunction = async ({ params, request }) => {
  console.log(params);
  const fd = await request.formData();
};

const ContactPage: React.FC = () => {
  const contact = useLoaderData() as IContact;

  return (
    <div id="contact">
      <div>
        <img key={contact.avatar} src={contact.avatar || ""} alt="contact" />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter && (
          <p>
            <a target="_blank" href={`https://twitter.com/${contact.twitter}`} rel="noreferrer">
              {contact.twitter}
            </a>
          </p>
        )}

        {contact.notes && <p>{contact.notes}</p>}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>
          <Form
            method="post"
            action="destroy"
            onSubmit={(event) => {
              if (!window.confirm("Please confirm you want to delete this record.")) {
                event.preventDefault();
              }
            }}>
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
};

const Favorite: React.FC<{ contact: IContact }> = ({ contact }) => {
  // yes, this is a `let` for later
  let favorite = contact.favorite;
  return (
    <Form method="post">
      <button
        name="favorite"
        value={favorite ? "false" : "true"}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}>
        {favorite ? "★" : "☆"}
      </button>
    </Form>
  );
};

export default ContactPage;

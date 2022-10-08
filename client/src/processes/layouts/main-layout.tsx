import React from "react";
import { Link, Outlet, useLoaderData, Form } from "react-router-dom";

export interface IContact {
  id: string;
  first: string;
  last: string;
  favorite: boolean;
  avatar: string;
  twitter: string;
  notes: string;
}

const contacts: IContact[] = Array.from({ length: 10 }).map((_, idx) => ({
  id: String(idx + 1),
  first: `First-${idx + 1}`,
  last: `Last-${idx + 1}`,
  avatar: "https://placekitten.com/g/200/200",
  twitter: "your_handle",
  notes: "Some notes",
  favorite: Boolean((idx + 1) % 2),
}));

export const mainLoader = async () => {
  return new Promise<{ contacts: unknown[] }>((res) => {
    setTimeout(() => {
      res({
        contacts: contacts,
      });
    }, 1500);
  });
};

export const mainAction = async () => {
  console.log("!!!");
  return new Promise<{ contacts: unknown[] }>((res) => {
    setTimeout(() => {
      res({
        contacts: [],
      });
    }, 1500);
  });
};

const MainLayout: React.FC = () => {
  const { contacts } = useLoaderData() as { contacts: IContact[] };

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <form id="search-form" role="search">
            <input id="q1" aria-label="Search contacts" placeholder="Search123" type="search" name="q1" />
            <input id="q2" aria-label="Search contacts" placeholder="Search321" type="search" name="q2" />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
            <button type="submit">ok</button>
          </form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;

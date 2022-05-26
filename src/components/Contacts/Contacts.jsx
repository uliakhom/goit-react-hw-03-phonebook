import { Component } from "react";
import { nanoid } from 'nanoid'
import ContactForm from "./ContactForm";
import Filter from "./Filter";
import ContactList from "./ContactList";
import s from './contacts.module.css'
import {initialState} from './initialState'

class Contacts extends Component {
    state = {
        contacts: [...initialState],
        filter: ''
    }
    
    componentDidMount() {
        const data = localStorage.getItem('items');
        const items = JSON.parse(data);
        if (items?.length) {
            this.setState({
                contacts: items
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { contacts } = this.state;
        if (prevState.contacts.length !== contacts.length) {
            const items = JSON.stringify(contacts);
            localStorage.setItem('items', items)
        }
    }
    addContact = (item) => {
        const { contacts } = this.state;
        const repeatedContact = contacts.find(contact => contact.number === item.number);
        if (repeatedContact) {
            alert(`${item.name} is already in contacts!`)
            return
        }

        this.setState(prevState => {
            const { contacts } = prevState;
            const { name, number } = item;
            const newContact = {
                name,
                number,
                id: nanoid()
            }
            return {
                contacts: [...contacts, newContact],
                name: '',
                number: ''
            }
        })
    }
    deleteContact = (id) => {
            this.setState(prevState => {
                const { contacts } = prevState
                return {
                    contacts: contacts.filter(contact => contact.id !== id)
                }
        })
    }

    filterContact = ({ target }) => {
        this.setState({
            filter: target.value
        })
    }

    getFilteredContacts () {
        const { contacts, filter } = this.state;
        if (!filter) return contacts;
        const filteredName = filter.toLowerCase();
        const filteredContacts = contacts.filter(({ name }) => {
            const result = name.toLowerCase().includes(filteredName)
            return result
        })
        return filteredContacts
    }

    render() {
        const { filter } = this.state;
        const { addContact, deleteContact, filterContact } = this;
        const contacts = this.getFilteredContacts();

        return (
            <div className={s.container}>
                <div className={s.phonebook}>
                    <h1 className={s.title}>Phonebook</h1>
                    <ContactForm onSubmit={addContact}/>
                </div>
                <div className={s.contacts}>
                    <h2 className={s.contacts__title}>Contacts</h2>
                    <Filter filterContact={filterContact} filter={filter} />
                    <ContactList contacts={contacts} deleteContact={deleteContact}/>
                

                </div>
            </div>
        )
    }

}

export default Contacts 


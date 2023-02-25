import { useState, useEffect, memo } from "react"
import { FaFileInvoice } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux";
import { viewInvoices } from "../features/invoice/InvoiceSlice";
import LoadingIcons from 'react-loading-icons'
import { toast } from 'react-toastify'

function ViewInvoices({}) {
    const [dates, setDates] = useState({
        datePrior: 10000,
        datePost: 0
    }) ;
    const [view, setView] = useState(false)

    var {datePrior, datePost} = dates ;

    const { invoice, isViewsDone, isError, isLoading, message } = useSelector((state) => state.invoice) ;
    const { user } = useSelector((state) => state.auth) ;
    const dispatch = useDispatch() ;

    const onChange = (e) => {
        e.preventDefault() 
        setDates((prevState) => ({
           ...prevState,
            [e.target.id] : e.target.value
        }))

    }

    const onSubmit = (e) => {
        e.preventDefault() ;
        console.log('dates are', dates)
        if(datePrior > datePost) {
            toast.error('Please enter your dates in the correct order.') 
        }
        else if (datePrior <= datePost) {
            console.log(user.email)
            dispatch(viewInvoices({"dates": dates, "email": user.email}));
        }
       
    }
    
    useEffect(() => {
        console.log(invoice)
        if(isViewsDone && invoice) {
            setView(true) ;
        };
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isViewsDone, invoice, isError, message])

    if(isLoading) {return (
        <div className="pageContainer">
            <header>
                <p className="pageHeader">
                    Retrieving your invoices - Just a moment.
                </p>
                <LoadingIcons.Circles />
            </header> 
         </div>
    )};

    return(
        <div className='pageContainer'>
            <header>
                <p className="pageHeader">
                    View Invoices <FaFileInvoice />
                </p>
            </header>
            <main>
                <p>Select what date range you would like to view your invoices for.</p>
                <p>Note: Dates should indicate purchase/service date - not the date that the invoice was submitted.</p>
                <form onSubmit={onSubmit}>
                    <p>From</p>
                        <input type="date"
                            className="calendarInput"
                            placeholder='YYYY-MM-DD'
                            id='datePrior'
                            value={datePrior}
                            onChange={onChange}
                            required
                        />
                    <p>To</p>
                    <input type="date"
                            className="calendarInput"
                            placeholder='YYYY-MM-DD'
                            id='datePost'
                            value={datePost}
                            onChange={onChange}
                            required
                        />
                    <button type='submit' className="submitButton">Submit</button>
                </form>
            </main>
        </div>
    )
}

export default ViewInvoices

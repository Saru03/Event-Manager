import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { useEffect } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';
import IconButton from '@mui/material/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

function Events() {
    const [events, setEvents] = useState([])
    const [allEvents, setAllEvents] = useState([]);
    const [message, setMessage] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [anchorEl, setAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('https://event-manager-oicx.onrender.com/events', { withCredentials: true })
                console.log(response.data)
                const eventsData = response.data.events || [];
                const formattedEvents = eventsData.map((event) => ({

                    id: event.id,
                    summary: event.summary || 'No Title',
                    date: event.start?.date ||
                        (event.start?.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : 'N/A'),
                    time: event.start?.dateTime ?
                        new Date(event.start.dateTime).toLocaleTimeString() : 'All Day',
                    location: event.location || 'N/A',
                }));
                setEvents(formattedEvents);
                setAllEvents(formattedEvents)
                setMessage(response.data.message);

            } catch (err) {
                console.error("Error fetching events:", err);
                if (err.response?.status === 401) {
                    window.location.href = '/login';
                } else {
                    setMessage(err.response?.data?.message || 'Failed to fetch events');
                }
            }
        }
        fetchEvents();
    }, [])

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`https://event-manager-oicx.onrender.com/events/${eventId}`, { 
                withCredentials: true 
            });
            const updatedEvents = events.filter(event => event.id !== eventId);
            const updatedAllEvents = allEvents.filter(event => event.id !== eventId);
            
            setEvents(updatedEvents);
            setAllEvents(updatedAllEvents);
            setMessage('Event deleted successfully');
        } catch (err) {
            console.error("Error deleting event:", err);
            setMessage(err.response?.data?.message || 'Failed to delete event');
        } finally {
            setLoading(false);
        }
    };

    const selectionRange = {
        startDate: startDate,
        endDate: endDate,
        key: 'selection',
    }
    const handleSelect = (date) => {
        let filtered = allEvents.filter((event) => {
            let eventDate = new Date(event.rawDate)
            return (
                eventDate >= date.selection.startDate &&
                eventDate <= date.selection.endDate
            );
        });
        setStartDate(date.selection.startDate)
        setEndDate(date.selection.endDate)
        setEvents(filtered)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <>
            {message && (
                <div className='m-4'>
                    <Alert
                        severity="warning"
                        onClose={() => setMessage('')}
                        className='mb-4'
                    >
                        {message}
                    </Alert>
                </div>
            )}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow align="right" sx={{ borderBottom: 'none' }} >
                            <TableCell colSpan={4} align="right" sx={{ borderBottom: 'none' }}>
                                <IconButton
                                    onClick={handleClick}
                                >
                                    <CalendarMonthIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Event Name</TableCell>
                            <TableCell align="right">Date</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Location

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow
                                key={event.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {event.summary}
                                </TableCell>
                                <TableCell align="right">{event.date}</TableCell>
                                <TableCell align="right">{event.time}</TableCell>
                                <TableCell align="right">{event.location}</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        onClick={() => handleDeleteEvent(event.id)}
                                        disabled={loading}
                                        color="error"
                                    >
                                        {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                />
            </Popover>


        </>
    )
}
export default Events
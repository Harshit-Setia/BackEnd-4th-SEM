export const register = async(id) =>{
    const response = await fetch(`http://localhost:4040/api/events/${id}/register`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
    })
    const data = await response.json()
    if (response.ok) {
        window.alert(data.message);
    } else {
        window.alert('login first');
        window.location.href = '/login';
    }
    
}
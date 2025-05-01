export function Form() {
    return (
        <form className="space-y-4">
            <label htmlFor="name" className="block text-lg font-medium">
                Enter Event Name:
            </label>
            <input type="text" id="name" className="inp" placeholder="Type event name..." />

            <label htmlFor="Date" className="block text-lg font-medium">
                Enter Event Date:
            </label>
            <input type="date" id="Date" className="inp" placeholder="Type event name..." />

            <label htmlFor="Poster" className="block text-lg font-medium">
                Enter Event Poster:
            </label>
            <input type="image" name="eventName" id="Poster" className="inp" placeholder="Submit" />

            <label htmlFor="head" className="block text-lg font-medium">
                Enter Event Head:
            </label>
            <input type="text" name="eventName" id="head" className="inp" placeholder="NaN" />


        </form>
    );
}

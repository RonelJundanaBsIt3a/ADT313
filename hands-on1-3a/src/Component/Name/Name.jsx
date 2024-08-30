import './Name.css'

function Name({fname,lname}){
    return (
        <div>
            <h1><span className='text-gray'>{fname}</span> <span>{lname}</span></h1>
        </div>
    )
}

export default Name;
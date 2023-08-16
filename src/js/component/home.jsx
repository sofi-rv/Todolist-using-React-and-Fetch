import React, { useState, useEffect } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";
import { stringify } from "query-string";

//create your first component
const Home = () => {
	const [tarea, setTarea] = useState("")
	const [lista, setLista] = useState([{ done: false, label: "No hay Tareas" }])
	const [username, setUsername] = useState("")

	const URI = "https://playground.4geeks.com/apis/fake/todos/user/"

	const handleInput = async (e) => {
		let objTexto = { label: e.target.value, done: false }
		if (e.keyCode == 13) {
			setTarea(e.target.value)
			//Una primera aproximación para agregar a la lista es usando una variable auxiliar
			//let tempArr = lista.slice() //copia de arreglo por valor
			//tempArr.push(texto)
			//setLista(tempArr)

			//Una segunda aproximación es usando el operador spread ...
			let arregloTemp = [...lista, objTexto]
			//Actualizar lista de Todos
			let response = await fetch(URI + username, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(arregloTemp)
			})
			if (response.ok) {
				//Aquí se actualiza la lista de tareas
				setLista([...lista, objTexto])

			} else {
				alert("Hubo un error al intentar actualizar")
			}


		}
	}

	const deleteTask = (index) => {
		let tempArr = lista.slice() //copiar el estado lista en una variable auxiliar
		tempArr = tempArr.filter((item, index2) => { return index2 != index })
		setLista(tempArr)
	}

	const handleUser = (e) => {
		let user = e.target.value
		setUsername(user)
	}

	useEffect(() => {
		const listLoading = async () => {
			let response = await fetch(URI + username) //como obviamos el segundo parametro, se entiende que el método es GET
			//response es una promesa
			if (response.ok) {
				//se realiza algo si esta dentro del status 200-299 
				let objResponse = await response.json()
				console.log("respuesta correcta", objResponse)
				setLista(objResponse)
			} else {
				//error
				console.log("ERROR")
			}
		}
		listLoading()

	}, [username])

	return (
		<>
			<div className="container">
				<p className="title-list d-flex justify-content-center text-danger text-opacity-25">Todos</p>
				<input placeholder="Usuario"
					onKeyUp={(e) => { handleUser(e) }
					}
				/>
				<ul className="list-group">
					<li className="list-group-item">
						<input className="form-control border-0" placeholder="Whats needs to be done?"
							onKeyUp={
								(e) => { handleInput(e) }
							} />
					</li>
					{
						lista && lista.length > 0 ?
							<>{
								lista.map((item, index) => {
									return <li className="list-group-item" key={index}>
										{item.label}
										<button className=" button btn btn-outline-light border-0" type="button" onClick={e => { deleteTask(index) }}>
											❌
										</button>
									</li>
								})
							}</>
							:
							<li className="list-group-item">The list is empty</li>
					}
					<li className="list-group-item text-secondary">
						{lista && lista.length > 0 ? <p className="footer"> {lista.length} item left </p> : <p>You have no tasks to do</p>}
					</li>

				</ul>
			</div>
		</>
	);
};


export default Home;

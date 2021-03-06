import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiPower, FiTrash2 } from "react-icons/fi";

// Style
import "./style.css";

// Components
import LogoImg from "../../assets/logo.svg";

// Service
import api from "../../services/api";

export default function Profile(){
    const ongName = localStorage.getItem("ongName");

    const history = useHistory();

    const ongID = localStorage.getItem("ongID");
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        api.get("profile", { headers: {authorization: ongID} }).then( response => { setIncidents( response.data ) } );
    }, [ongID]);

    async function handleDelete(id){
        try{
            // return console.log(`ID caso: ${id}` + " | ID ong: " + ongID);
            await api.delete("incidents/" + id, { headers: {authorization: ongID} });

        } catch(err){
            console.log( err );
            alert("Ocorreu um erro ao tentar deletar o caso, por favor tente mais tarde");

        }

        setIncidents(incidents.filter(incident => incident.id !== id));
    }

    function handleLogout(){
        localStorage.clear();
        history.push("/");
    }

    return (
        <div className="profile-container">
            <header>
                <img src={LogoImg} alt="Be the hero" />
                <span>Bem vinda, {ongName}</span>

                <Link className="button" to="/incidents/new">
                    Cadastrar novo caso
                </Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="#e02041" />
                </button>
            </header>

            <h1>Casos Cadastrados</h1>
            <ul>
                {incidents.map( incident => (
                    <li key={ incident.id }>
                        <strong>CASOS:</strong>
                        <p>{ incident.title }</p>

                        <strong>DESCRIÇÃO:</strong>
                        <p>{ incident.description }</p>

                        <strong>VALOR:</strong>
                        <p>{Intl.NumberFormat("pt-BR", {style: "currency", currency: "BRL"}).format(incident.value)}</p>

                        <button type="button" onClick={ () => handleDelete(incident.id) }>
                            <FiTrash2 size={20} color="#a8a8b3" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

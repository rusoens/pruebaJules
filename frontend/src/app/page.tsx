'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { currentUser, isLoading } = useAuth();

  return (
    <>
      <div className="px-4 py-5 my-5 text-center">
        <img className="d-block mx-auto mb-4" src="/briefcase.svg" alt="Logo" width="72" height="57" />
        <h1 className="display-5 fw-bold text-body-emphasis">Bolsa de Trabajo de Oficios</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">
            {isLoading ? 'Cargando...' :
              currentUser ? `Bienvenido/a de nuevo, ${currentUser.name || currentUser.data?.name}!` : 'Conectando clientes con profesionales calificados.'
            }
            <br/>
            Encuentra el servicio que necesitas o publica tus habilidades para conseguir nuevos proyectos.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link href="/jobs" className="btn btn-primary btn-lg px-4 gap-3">Ver Trabajos Disponibles</Link>
            <Link href="/professionals" className="btn btn-outline-secondary btn-lg px-4">Buscar Profesionales</Link>
          </div>
        </div>
      </div>

      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
           <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-person-check-fill" viewBox="0 0 16 16"><path fillRule="evenodd" d="M15.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L12.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/><path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Para Clientes</h3>
            <p>Publica tu proyecto y recibe propuestas de profesionales calificados en tu área. Es fácil, rápido y gratuito.</p>
            {(!currentUser || currentUser.role === 'client' || currentUser.data?.role === 'client') &&
              <Link href="/jobs/create" className="btn btn-success">Publicar un Trabajo</Link>
            }
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-tools" viewBox="0 0 16 16"><path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.356 3.356a1 1 0 0 0 1.414 0l1.586-1.586a1 1 0 0 0 0-1.414l-3.356-3.356a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 3l2.48-2.48A3.005 3.005 0 0 0 13 0zM12.973 1.35l-2.645 2.646-2.027-2.027L10.945 0l2.028.027zM11.354 4.207l-2.646 2.646-2.027-2.027L9.325 3l2.028.027zm-.706 2.138L8.621 8.37l-2.027-2.027L8.621 4.32l2.028.027zM3.621 10.37l2.027 2.027L7.675 10.37l-2.028-.027zm3.706-2.138l2.646-2.646 2.027 2.027L12.379 10l-2.028-.027z"/></svg>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Para Profesionales</h3>
            <p>Crea tu perfil, muestra tus habilidades y accede a una amplia gama de oportunidades de trabajo en tu especialidad.</p>
            {(!currentUser || currentUser.role === 'professional' || currentUser.data?.role === 'professional') &&
              <Link href={currentUser ? "/profile/edit" : "/register"} className="btn btn-info">
                {currentUser ? "Actualizar Perfil" : "Regístrate como Profesional"}
              </Link>
            }
          </div>
        </div>
        <div className="col d-flex align-items-start">
          <div className="icon-square text-body-emphasis bg-body-secondary d-inline-flex align-items-center justify-content-center fs-4 flex-shrink-0 me-3">
           <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16"><path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/></svg>
          </div>
          <div>
            <h3 className="fs-2 text-body-emphasis">Conexión Directa</h3>
            <p>Facilitamos el contacto directo vía WhatsApp para que puedas coordinar los detalles del trabajo sin intermediarios.</p>
          </div>
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" style={{display: 'none'}}>
        <symbol id="briefcase" viewBox="0 0 16 16">
            <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"/>
        </symbol>
      </svg>
      <script dangerouslySetInnerHTML={{ __html: `
        document.querySelectorAll('img[src="/briefcase.svg"]').forEach(img => {
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#briefcase');
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', img.getAttribute('width') || '72');
            svg.setAttribute('height', img.getAttribute('height') || '57');
            svg.setAttribute('fill', 'currentColor');
            svg.classList.add('bi');
            svg.appendChild(use);
            if (img.parentNode) {
              img.parentNode.replaceChild(svg, img);
            }
        });
      `}} />
    </>
  );
}

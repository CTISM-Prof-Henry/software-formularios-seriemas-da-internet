import React, {useState} from 'react';
import {FiFilter, FiSliders, FiEye, FiDownload, FiCheck} from 'react-icons/fi';
import '../../style/Exportar.css'

function ExportacaoDados() {

    const [filtros, setFiltros] = useState({
        periodo: '30',
        categoria: 'todas',
        impacto: {critico: true, alto: true, medio: false, baixo: false}
    });


    const [colunas, setColunas] = useState({
        id: true,
        descricao: true,
        categoria: true,
        criticidade: true,
        status: true,
        responsavel: false,
        dataCriacao: false,
        planoAcao: false
    });


    const amostraDados = [
        {
            id: 'RSK-042',
            descricao: 'Falta de contingência para falhas de servidores...',
            categoria: 'Operacional',
            criticidade: 'Crítico',
            status: 'Em Análise'
        },
        {
            id: 'RSK-089',
            descricao: 'Atraso no repasse de verbas ministeriais...',
            categoria: 'Financeiro',
            criticidade: 'Alto',
            status: 'Mitigado'
        },
        {
            id: 'RSK-103',
            descricao: 'Adequação incompleta às novas normativas...',
            categoria: 'Conformidade',
            criticidade: 'Alto',
            status: 'Aberto'
        }
    ];

    const handleImpactoChange = (nivel) => {
        setFiltros({
            ...filtros,
            impacto: {...filtros.impacto, [nivel]: !filtros.impacto[nivel]}
        });
    };

    const handleColunaChange = (coluna) => {
        setColunas({...colunas, [coluna]: !colunas[coluna]});
    };

    const selecionarTodasColunas = () => {
        const todasAtivas = Object.keys(colunas).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setColunas(todasAtivas);
    };

    const acionarExportacao = async () => {
        try {

            const impactosSelecionados = Object.keys(filtros.impacto)
                .filter(nivel => filtros.impacto[nivel])
                .join(',');


            const colunasSelecionadas = Object.keys(colunas)
                .filter(col => colunas[col])
                .join(',');


            const params = new URLSearchParams({
                periodo: filtros.periodo,
                categoria: filtros.categoria,
                impactos: impactosSelecionados,
                colunas: colunasSelecionadas
            });


            const response = await fetch(`http://localhost:8000/api/riscos/exportar/csv/?${params.toString()}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Falha ao gerar o arquivo no servidor.');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `Exportacao_Riscos_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (erro) {
            console.error("Erro na exportação:", erro);
            alert("Ocorreu um erro ao tentar exportar os dados.");
        }
    };

    const acionarExportacaoPDF = async () => {
        try {
            const impactosSelecionados = Object.keys(filtros.impacto).filter(nivel => filtros.impacto[nivel]).join(',');
            const colunasSelecionadas = Object.keys(colunas).filter(col => colunas[col]).join(',');

            const params = new URLSearchParams({
                periodo: filtros.periodo,
                categoria: filtros.categoria,
                impactos: impactosSelecionados,
                colunas: colunasSelecionadas
            });

            const response = await fetch(`http://localhost:8000/api/riscos/exportar/pdf/?${params.toString()}`, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Falha ao gerar o arquivo PDF.');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `Relatorio_Riscos_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (erro) {
            console.error("Erro na exportação PDF:", erro);
            alert("Ocorreu um erro ao tentar exportar para PDF.");
        }
    };


    return (
        <div className="export-page-container">
            <div className="export-header">
                <h1>Exportação de Dados</h1>
                <p>Configure os filtros e colunas para gerar um relatório em formato CSV ou PDF.</p>
            </div>

            <div className="export-grid-layout">

                <aside className="export-sidebar">
                    <div className="export-card">
                        <div className="card-title-with-icon">
                            <FiFilter className="icon-blue"/>
                            <h2>Filtros de Dados</h2>
                        </div>

                        <div className="filter-group">
                            <label>Período</label>
                            <select
                                value={filtros.periodo}
                                onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
                            >
                                <option value="30">Últimos 30 dias</option>
                                <option value="90">Últimos 90 dias</option>
                                <option value="365">Este Ano</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Categoria de Risco</label>
                            <select
                                value={filtros.categoria}
                                onChange={(e) => setFiltros({...filtros, categoria: e.target.value})}
                            >
                                <option value="todas">Todas as Categorias</option>
                                <option value="Operacional">Operacional</option>
                                <option value="Financeiro">Financeiro</option>
                                <option value="Estratégico">Estratégico</option>
                                <option value="Legal">Legal</option>
                                <option value="Imagem">Imagem</option>
                                <option value="Integridade">Integridade</option>
                                <option value="Ambiente">Ambiente Extremo</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Nível de Impacto</label>
                            <div className="checkbox-badge-grid">
                                {Object.keys(filtros.impacto).map((nivel) => (
                                    <label
                                        key={nivel}
                                        className={`checkbox-badge-label ${filtros.impacto[nivel] ? 'active' : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filtros.impacto[nivel]}
                                            onChange={() => handleImpactoChange(nivel)}
                                        />
                                        <span>{nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>


                    <div className="export-ready-card">
                        <h3>Pronto para exportar?</h3>
                        <p>O arquivo gerado conterá aproximadamente 245 registros baseado nos filtros selecionados.</p>

                        <div className="export-card-actions">
                            <button className="btn-export-action" onClick={acionarExportacao}>
                                <FiDownload/> Exportar CSV
                            </button>
                            <button className="btn-export-action btn-pdf" onClick={acionarExportacaoPDF}>
                                <FiDownload/> Exportar PDF
                            </button>
                        </div>

                    </div>
                </aside>


                <div className="export-main-content">

                    <div className="export-card">
                        <div className="card-header-actions">
                            <div className="card-title-with-icon">
                                <FiSliders className="icon-blue"/>
                                <h2>Colunas Incluídas</h2>
                            </div>
                            <button className="btn-text-link" onClick={selecionarTodasColunas}>
                                Selecionar Todas
                            </button>
                        </div>

                        <div className="columns-checkbox-grid">
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.id} onChange={() => handleColunaChange('id')}/>
                                <span>ID do Risco</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.descricao}
                                       onChange={() => handleColunaChange('descricao')}/>
                                <span>Descrição</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.categoria}
                                       onChange={() => handleColunaChange('categoria')}/>
                                <span>Categoria</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.criticidade}
                                       onChange={() => handleColunaChange('criticidade')}/>
                                <span>Criticidade</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.status}
                                       onChange={() => handleColunaChange('status')}/>
                                <span>Status Atual</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.responsavel}
                                       onChange={() => handleColunaChange('responsavel')}/>
                                <span>Responsável</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.dataCriacao}
                                       onChange={() => handleColunaChange('dataCriacao')}/>
                                <span>Data de Criação</span>
                            </label>
                            <label className="custom-checkbox-item">
                                <input type="checkbox" checked={colunas.planoAcao}
                                       onChange={() => handleColunaChange('planoAcao')}/>
                                <span>Plano de Ação</span>
                            </label>
                        </div>
                    </div>


                    <div className="export-card">
                        <div className="card-header-actions">
                            <div className="card-title-with-icon">
                                <FiEye className="icon-blue"/>
                                <h2>Pré-visualização dos Dados</h2>
                            </div>
                            <span className="sample-badge">Amostra: 3 linhas</span>
                        </div>

                        <div className="table-responsive">
                            <table className="export-preview-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DESCRIÇÃO</th>
                                    <th>CATEGORIA</th>
                                    <th>CRITICIDADE</th>
                                    <th>STATUS</th>
                                </tr>
                                </thead>
                                <tbody>
                                {amostraDados.map((row, index) => (
                                    <tr key={index}>
                                        <td><strong>{row.id}</strong></td>
                                        <td className="truncate-text">{row.descricao}</td>
                                        <td>{row.categoria}</td>
                                        <td>
                                               <span
                                                   className={`table-criticidade-badge ${row.criticidade.toLowerCase() === 'crítico' ? 'badge-critico' : 'badge-alto'}`}>
                                                   {row.criticidade}
                                               </span>
                                        </td>
                                        <td>{row.status}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="table-footer-notes">
                            Visualizando 3 de 245 registros filtrados. O arquivo final conterá todos os dados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExportacaoDados;
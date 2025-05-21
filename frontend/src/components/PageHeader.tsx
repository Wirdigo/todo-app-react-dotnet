import React from 'react';
import Globus from '../features/task/components/Globus';
import pageStyles from '../pages/TaskPage.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons/faArrowLeft";

interface PageHeaderProps {
    isAddingTask: boolean;
    onToggleAddTask: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ isAddingTask, onToggleAddTask }) => {
    return (
        <header className={pageStyles.headerContainer}>
            <div
                className={`${pageStyles.logoTitleContainer} ${isAddingTask ? pageStyles.logoDisabled : ''}`}
                onClick={!isAddingTask ? onToggleAddTask : undefined}
                role={!isAddingTask ? "button" : undefined}
                tabIndex={!isAddingTask ? 0 : undefined}
                onKeyDown={!isAddingTask ? (e) => (e.key === 'Enter' || e.key === ' ') && onToggleAddTask() : undefined}
                title={!isAddingTask ? "Add a new task" : undefined}
            >
                <Globus className={pageStyles.globeIcon} />
                <h1 className={pageStyles.todoTitle}>ToDo</h1>
            </div>

            {!isAddingTask && (
                <div className={pageStyles.newTaskPrompt}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                    <span className={pageStyles.newTaskText}> New task to do</span>
                </div>
            )}
        </header>
    );
};

export default PageHeader;
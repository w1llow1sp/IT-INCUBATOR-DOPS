import React, {useState} from 'react';
import './App.css';
import {TaskType, Todolist} from './Todolist';
import {v1} from 'uuid';

export type FilterValuesType = "all" | "active" | "completed";
type TodolistsType = { id: string, title: string }
type TasksType = {
    [key: string]: {
        data:TaskType[]
        filter:FilterValuesType
    }
}

function App() {

    let todolistId1 = v1();
    let todolistId2 = v1();
    //1.Исправляем ошибку в типе у стейта
    //2.Убираем тип filter

    let [todolists, setTodolists] = useState<Array<TodolistsType>>([
        {id: todolistId1, title: "What to learn"},
        {id: todolistId2, title: "What to buy"}
    ])
    //3.Вставляем корректный тип
    //4.Изменяем тип TasksType
    let [tasks, setTasks] = useState<TasksType>({
        [todolistId1]: {
            data: [
                {id: v1(), title: "HTML&CSS1111", isDone: true},
                {id: v1(), title: "JS1111", isDone: true}
            ],
            filter: "all"
        },
        [todolistId2]: {
            data: [
                {id: v1(), title: "HTML&CSS22222", isDone: true},
                {id: v1(), title: "JS2222", isDone: true}
            ],
            filter: "all"
        }
    });


    const removeTodolist = (todolistId: string) => {
        // берем массив из тудулистов, создаем копию массива и в нем удалем тудулист по айди
        setTodolists(todolists.filter(el=>el.id!==todolistId))
    }


    function removeTask(todolistId: string, taskId: string) {
        //1.создаем копию всего обьекта с тасками:
        //{...tasks}
        //2.Теперь добираемся до тудушки с нужным ключом todolistId ( создаем копию всего объекта)
        //{...tasks,[todolistId]:{...tasks[todolistId]}
        //3.Внутри нужного тудулиста мы делаем копию data и filter (создаем копию массива с ключом data)
        //{...tasks,[todolistId]:{...tasks[todolistId],data:tasks[todolistId]}
        //4. Добираемся до обьекта внутри data[] по нужному id и удаляем его через метод filter (внутри обьекта с ключом data изменяем обьект с нужным id)
        //{...tasks,[todolistId]:{...tasks[todolistId],data:tasks[todolistId].data.filter(el=> el.id !==taskId)}}
        setTasks({...tasks,[todolistId]:{...tasks[todolistId],data:tasks[todolistId].data.filter(el=> el.id !==taskId)}})

    }

    function addTask(todolistId: string, title: string) {
        // по аналогии с removeTask,только мы  образаемся к масссиву data через spred-operator и добавляем newTasks
        let newTask ={id: v1(), title, isDone: false }
        setTasks({...tasks,[todolistId]:{...tasks[todolistId],data:[...tasks[todolistId].data,newTask]}})
    }

    function changeStatus(todolistId: string, taskId: string, newIsDone: boolean) {
        setTasks({...tasks,[todolistId]:{...tasks[todolistId],data:tasks[todolistId].data.map(el=> el.id === taskId? {...el,isDone: newIsDone}:el)}})
    }

    function changeFilter(todolistId: string, value: FilterValuesType) {
        setTasks({...tasks,[todolistId]:{...tasks[todolistId],filter:value}})
    }

    return (
        <div className="App">
            {todolists.map((el) => {
                let tasksForTodolist = tasks[el.id].data;
                if (tasks[el.id].filter === "active") {
                    tasksForTodolist = tasks[el.id].data.filter(t => t.isDone === false);
                }
                if (tasks[el.id].filter=== "completed") {
                    tasksForTodolist = tasks[el.id].data.filter(t => t.isDone === true);
                }
                return (
                    <Todolist
                        key={el.id}
                        todolistId={el.id}
                        title={el.title}
                        tasks={tasksForTodolist}
                        removeTask={removeTask}
                        changeFilter={changeFilter}
                        addTask={addTask}
                        changeTaskStatus={changeStatus}
                        filter={tasks[el.id].filter}
                        removeTodolist={removeTodolist}
                    />
                )
            })}


        </div>
    );
}

export default App;

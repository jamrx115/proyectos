<?php

class My_Timetracker extends My_Api
{
	public function execCreatorAction($model, $request, $user) {
		$path = explode("/", $model->find($request->getParam('projectId'))->path);
		$level = count($path) - 1;

		switch ($level) {
			case '1':
				$column = 'ttClientId';
				$response = $this->createClient(
							$request->getParam('title'),
							$request->getParam('notes') );
				break;
			case '2':
				$column = 'ttProjectId';
				$idClient = $model->find($request->getParam('projectId'))->ttClientId;
				$response = $this->createProject(
							$request->getParam('title'),
							$request->getParam('notes'),
							$this->getTimetrackerIdUsers( $user, 
						array_values($request->getParam('dataAccess')) ),
							$idClient );
				break;
			case '5':
				$column = 'ttTaskId';
				$idProject = $model->find($path[3])->ttProjectId;
				$response = $this->createTask(
							$request->getParam('title'),
							$request->getParam('notes'),
							$this->getTimetrackerIdUsers( $user, 
						array_values($request->getParam('dataAccess')) ),
							$idProject );
				break;
			default:
				return $request->getParams();
				break;

		}
		
		if($response) {
			return array_merge( 	$request->getParams(), 
						array($column => $response->ID) );
		}

		return $request->getParams();
	}

	public function execUpdaterAction($model, $request, $user) {

		$path = explode("/", $model->path);
		$level = count($path) - 2;

		switch ($level) {
			case '1':
				$column = 'ttClientId';
				$response = $this->updateClient(
							$model->ttClientId,
							$request->getParam('title'),
							$request->getParam('notes') );
				break;
			case '2':
				$column = 'ttProjectId';
				$response = $this->updateProject(
							$model->ttProjectId,
							$request->getParam('title'),
							$request->getParam('notes'),
							$this->getTimetrackerIdUsers( $user, 
						array_values($request->getParam('dataAccess')) ) );
				break;
			case '5':
				$column = 'ttTaskId';
				$ttTaskId = $model->ttTaskId;
				$idProject = $model->find($path[3])->ttProjectId;
				$response = $this->updateTask(
							$ttTaskId,
							$request->getParam('title'),
							$request->getParam('notes'),
							$idProject,
							$this->getTimetrackerIdUsers( $user, 
						array_values($request->getParam('dataAccess')) ) );
				break;
			default:
				return $request->getParams();
				break;
		}

		if($response) {
			return array_merge( 	$request->getParams(), 
						array($column => $response->ID) );
		}

		return $request->getParams();
	}

	public function execDeleteAction($model, $helper_model) {
		$path = explode("/", $model->path);
		$level = count($path) - 2;

		switch ($level) {
			case '1':
				$response = $this->deleteClient($model->ttClientId);
				break;
			case '2':
				$response = $this->deleteProject($model->ttProjectId);
				break;
			case '5':
				$response = $this->deleteTask($model->ttTaskId);
				break;
			default:
				return true;
				break;
		}

		return $response;
	}	

	public function createProject($name, $desc = '', $users, $client) {

		$data = array(
				'project_name' => $name,
				'project_desc' => $desc,
				'project_users' => $users,
				'project_client' => $client
				);

		$this->setData(array('action' => 'project', 'data' => $data));
		$this->sendPostRequest();

		return $this->getResponse();
	}

	public function updateProject($id, $name, $desc = '', $users) {
		
		$data = array(
				'project_id' 	=> $id,
				'project_name' 	=> $name,
				'project_desc' 	=> $desc,
				'project_users' => $users
				);
		
		$this->setData(array('action' => 'project', 'data' => $data));		
		$this->sendPutRequest();

		return $this->getResponse();
	}

	public function deleteProject($id) {

		$data = array(
				'project_id' => $id
				);
		$this->setData(array('action' => 'project', 'data' => $data));		
		$this->sendDeleteRequest();

		return $this->getResponse();
	}

	public function createClient($name, $desc = '') {

		$data = array(
				'client_name' => $name,
				'client_desc' => $desc
				);
		
		$this->setData(array('action' => 'client', 'data' => $data));
		$this->sendPostRequest();

		return $this->getResponse();
	}

	public function updateClient($id, $name, $desc = '') {
		
		$data = array(
				'client_id' 	=> $id,
				'client_name' 	=> $name,
				'client_desc' 	=> $desc
				);
		
		$this->setData(array('action' => 'client', 'data' => $data));		
		$this->sendPutRequest();

		return $this->getResponse();
	}

	public function deleteClient($id) {

		$data = array(
				'client_id' => $id
				);
		$this->setData(array('action' => 'client', 'data' => $data));		
		$this->sendDeleteRequest();

		return $this->getResponse();
	}

	public function createUser($name = '', $username, $password, $email = '') {
		
		$data = array(
				'user_name' => $name,
				'user_username' => $username,
				'user_password' => $password,
				'email' => $email,
				);
		$this->setData(array('action' => 'user', 'data' => $data));
		$this->sendPostRequest();

		return $this->getResponse();
	}

	public function updateUser($id, $name = '', $username, $password, $email = '') {
		
		$data = array(
				'user_id' 	=> $id,
				'user_name' => $name,
				'user_username' => $username,
				'user_password' => $password,
				'email' => $email,
				);
		$this->setData(array('action' => 'user', 'data' => $data));		
		$this->sendPutRequest();

		return $this->getResponse();
	}

	public function getTimetrackerIdUsers($model, $ids) {
		
		$result = array();
		foreach ($ids as $id) {
			$user = $model->find($id);
			$result[] = $user->timetrackerId;
		}
		
		return $result;
	}

	public function createTask($name, $desc = '', $users, $project) {
		$data = array(
				'task_name' => $name,
				'task_desc' => $desc,
				'task_users_ids' => $users,
				'task_project_id' => $project
				);
		$this->setData(array('action' => 'task', 'data' => $data));
		$this->sendPostRequest();

		return $this->getResponse();
	}

	public function updateTask($id, $name, $desc = '', $project, $users) {
		$data = array(
				'task_id'   => $id,
				'task_name' => $name,
				'task_desc' => $desc,
				'task_project_id' => $project,
				'task_users_ids' => $users
				);
		$this->setData(array('action' => 'task', 'data' => $data));
		$this->sendPutRequest();

		return $this->getResponse();
	}

	public function deleteTask($id) {

		$data = array(
				'task_id' => $id
				);
		$this->setData(array('action' => 'task', 'data' => $data));		
		$this->sendDeleteRequest();

		return $this->getResponse();
	}
}

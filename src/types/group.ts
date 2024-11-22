export interface CreateGroupData {
	groupName: string;
	member: string[];
	startDate: string;
	endDate: string;
}

export interface Group {
	id: string;
	group_name: string;
	start_date: string;
	end_date: string;
	tags: string[];
	amount_per_person?: number;
}

export type Member = string;
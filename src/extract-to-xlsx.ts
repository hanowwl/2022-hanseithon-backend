/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-var */
import path from 'path';
import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import XlsxPopulate from 'xlsx-populate';
import { Team, TeamMember, User } from './entities';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.TYPEORM_HOST,
  port: parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Team, TeamMember],
});

const POSITIONS = {
  PM: '기획자',
  DEVELOPER: '개발자',
  DESIGN: '디자이너',
};

const SCHOOL_DEPARTMENT = {
  네트워크보안과: 'N',
  클라우드보안과: 'C',
  해킹보안과: 'H',
  '메타버스 게임과': 'G',
  게임과: 'G',
};

const fillZero = (int: number) => (int > 9 ? int.toString() : `0${int}`);

interface FormattedTeam {
  name: string;
  members: {
    serial: string;
    position: string;
    name: string;
    owner: boolean;
  }[];
}

const main = async () => {
  try {
    await AppDataSource.initialize();
    const teamRepository = AppDataSource.getRepository(Team);

    const getTeamData = async (): Promise<FormattedTeam[]> => {
      const teams = await teamRepository.find({
        relations: ['owner', 'members', 'members.user'],
      });

      const formattedTeamData = teams
        .map((team) => {
          return {
            name: team.name,
            members: team.members
              .map(({ user, position }) => {
                const {
                  studentDepartment,
                  studentGrade,
                  studentClassroom,
                  studentNumber,
                } = user;

                const serial =
                  SCHOOL_DEPARTMENT[studentDepartment] +
                  studentGrade +
                  studentClassroom +
                  fillZero(studentNumber);

                return {
                  serial,
                  position: POSITIONS[position],
                  name: user.name,
                  owner: team.owner.id === user.id,
                };
              })
              .sort((a: any, b: any) => b.owner - a.owner),
          };
        })
        .sort();

      return formattedTeamData;
    };

    const saveToXlsx = async (teamData: FormattedTeam[]) => {
      const workbook = await XlsxPopulate.fromBlankAsync();
      const sheet = workbook.sheet(0);

      sheet.column('B').width(12).hidden(false);
      sheet.column('C').width(11).hidden(false);
      sheet.column('D').width(11).hidden(false);
      sheet.column('E').width(11).hidden(false);
      sheet.column('F').width(11).hidden(false);

      const addHeader = (cell: number) => {
        sheet.cell(`B${cell}`).value('팀명').style({ bold: true });
        sheet.cell(`C${cell}`).value('학번').style({ bold: true });
        sheet.cell(`D${cell}`).value('이름').style({ bold: true });
        sheet.cell(`E${cell}`).value('역할').style({ bold: true });
        sheet.cell(`F${cell}`).value('기타').style({ bold: true });
      };

      sheet
        .range('B4:F100')
        .style({ horizontalAlignment: 'center', verticalAlignment: 'center' });

      let lastRow = 2;
      for (var i = 0; i < teamData.length; i++) {
        const team = teamData[i];

        let range = sheet.range(`B${lastRow + 3}:B${lastRow + 6}`);
        let teamRange = sheet.range(`B${lastRow + 2}:F${lastRow + 6}`);
        teamRange.style({ border: true });
        if (i === 0) sheet.range(`B4:B9`);

        addHeader(lastRow + 2);

        console.log(`=== start export team_id: ${i} ====`);

        for (var j = 0; j < team.members.length; j++) {
          const member = team.members[j];
          const row = lastRow + 3 + j;

          sheet.cell(`C${row}`).value(member.serial);
          sheet.cell(`D${row}`).value(member.name);
          sheet.cell(`E${row}`).value(member.position);
          sheet.cell(`F${row}`).value(member.owner ? '팀장' : '팀원');

          console.log(`export team_id: ${i}, member_id ${j}`);
        }

        console.log(`=== finish export team_id: ${i} ===`);

        lastRow = lastRow + 6;

        range.value(team.name);
        range.merged(true);
      }

      await workbook.toFileAsync('./한세톤-참가팀명단.xlsx');
    };

    const teamData = await getTeamData();
    await saveToXlsx(teamData);
    console.log('export finished');
  } catch (error) {
    console.log(error);
  }
};

main();
